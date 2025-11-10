<?php

namespace App\Services;

use App\Models\Household\Household;
use App\Models\Household\TechnicalData;

class HouseholdScoreCalculator
{
    /**
     * Calculate all scores for a household and update the database
     */
    public function calculateAndSave(Household $household): array
    {
        $technicalData = $household->technicalData;

        if (!$technicalData) {
            throw new \Exception('Technical data not found for household');
        }

        // Calculate individual scores
        $scoreA1 = $this->calculateScoreA1($technicalData);
        $scoreA2FloorArea = $this->calculateScoreA2FloorArea($technicalData, $household);
        $scoreA2Structure = $this->calculateScoreA2Structure($technicalData);
        $scoreA2TotalPct = (($scoreA2FloorArea + $scoreA2Structure) / 2) * 100;

        $scoreA3Access = $this->calculateScoreA3Access($technicalData);
        $scoreA3Fulfillment = $this->calculateScoreA3Fulfillment($technicalData);

        $scoreA4Access = $this->calculateScoreA4Access($technicalData);
        $scoreA4Technical = $this->calculateScoreA4Technical($technicalData);

        $scoreA5 = $this->calculateScoreA5($technicalData);

        // Calculate total score
        $totalScore = (
            $scoreA1 * 20 +
            $scoreA2TotalPct * 0.20 +
            $scoreA3Access * 15 +
            $scoreA3Fulfillment * 10 +
            $scoreA4Access * 15 +
            $scoreA4Technical * 10 +
            $scoreA5 * 10
        );

        // Determine habitability status
        $habitabilityStatus = $totalScore >= 60 ? 'RLH' : 'RTLH';

        // Update technical_data scores
        $technicalData->update([
            'score_a1' => $scoreA1,
            'score_a2_floor_area' => $scoreA2FloorArea,
            'score_a2_structure' => $scoreA2Structure,
            'score_a2_total_pct' => $scoreA2TotalPct,
            'score_a3_access' => $scoreA3Access,
            'score_a3_fulfillment' => $scoreA3Fulfillment,
            'score_a4_access' => $scoreA4Access,
            'score_a4_technical' => $scoreA4Technical,
            'score_a5' => $scoreA5,
        ]);

        // Update household status and score
        $household->update([
            'habitability_status' => $habitabilityStatus,
            'eligibility_score_total' => $totalScore,
            'eligibility_computed_at' => now(),
        ]);

        // Update or create household_scores record
        $household->score()->updateOrCreate(
            ['household_id' => $household->id],
            [
                'score_a1' => $scoreA1,
                'score_a2_floor_area' => $scoreA2FloorArea,
                'score_a2_structure' => $scoreA2Structure,
                'score_a2_total_pct' => $scoreA2TotalPct,
                'score_a3_access' => $scoreA3Access,
                'score_a3_fulfillment' => $scoreA3Fulfillment,
                'score_a4_access' => $scoreA4Access,
                'score_a4_technical' => $scoreA4Technical,
                'score_a5' => $scoreA5,
                'total_score' => $totalScore,
                'habitability_status' => $habitabilityStatus,
                'computed_at' => now(),
            ]
        );

        return [
            'total_score' => $totalScore,
            'habitability_status' => $habitabilityStatus,
            'scores' => [
                'a1' => $scoreA1,
                'a2_floor_area' => $scoreA2FloorArea,
                'a2_structure' => $scoreA2Structure,
                'a2_total_pct' => $scoreA2TotalPct,
                'a3_access' => $scoreA3Access,
                'a3_fulfillment' => $scoreA3Fulfillment,
                'a4_access' => $scoreA4Access,
                'a4_technical' => $scoreA4Technical,
                'a5' => $scoreA5,
            ],
        ];
    }

    /**
     * A.1 Keteraturan Bangunan
     */
    private function calculateScoreA1(TechnicalData $data): int
    {
        // Score = 1 if all conditions met
        if (
            $data->has_road_access == 1 &&
            $data->facade_faces_road == 1 &&
            in_array($data->road_width_category, ['EQ1_5', 'GT1_5']) &&
            ($data->faces_waterbody == 0 || $data->faces_waterbody === null) &&
            ($data->in_setback_area == 0 || $data->in_setback_area === null) &&
            $data->in_hazard_area == 0
        ) {
            return 1;
        }

        return 0;
    }

    /**
     * A.2.1 Luas Lantai
     */
    private function calculateScoreA2FloorArea(TechnicalData $data, Household $household): int
    {
        // Calculate area per person
        $buildingArea = $data->building_area_m2 ?? 0;
        $memberTotal = $household->member_total ?? 1;

        $areaPerPerson = $memberTotal > 0 ? $buildingArea / $memberTotal : 0;

        // Update area_per_person_m2 in technical data
        $data->update([
            'area_per_person_m2' => $areaPerPerson > 0 ? $areaPerPerson : null,
        ]);

        return $areaPerPerson >= 7.2 ? 1 : 0;
    }

    /**
     * A.2.2 Struktur (Atap, Dinding, Lantai)
     */
    private function calculateScoreA2Structure(TechnicalData $data): int
    {
        // Score = 1 if all conditions met
        if (
            $data->roof_condition == 'GOOD' &&
            $data->wall_condition == 'GOOD' &&
            $data->floor_condition != 'TIDAK_LAYAK'
        ) {
            return 1;
        }

        return 0;
    }

    /**
     * A.3.1 Akses Air
     */
    private function calculateScoreA3Access(TechnicalData $data): int
    {
        $source = $data->water_source;
        $distance = $data->water_distance_category;

        // Score = 1 if good water source OR protected source with safe distance
        if (in_array($source, ['SR_METERAN', 'SR_NONMETER', 'HUJAN'])) {
            return 1;
        }

        if (
            in_array($source, ['SUMUR_BOR', 'SUMUR_TRL', 'MATA_AIR_TRL']) &&
            $distance == 'GE10M'
        ) {
            return 1;
        }

        return 0;
    }

    /**
     * A.3.2 Pemenuhan Air
     */
    private function calculateScoreA3Fulfillment(TechnicalData $data): int
    {
        return $data->water_fulfillment == 'ALWAYS' ? 1 : 0;
    }

    /**
     * A.4.1 Akses Sanitasi
     */
    private function calculateScoreA4Access(TechnicalData $data): int
    {
        return $data->defecation_place == 'PRIVATE_SHARED' ? 1 : 0;
    }

    /**
     * A.4.2 Teknis Sanitasi
     */
    private function calculateScoreA4Technical(TechnicalData $data): int
    {
        // Score = 1 if both conditions met
        if (
            $data->toilet_type == 'S_TRAP' &&
            $data->sewage_disposal == 'SEPTIC_IPAL'
        ) {
            return 1;
        }

        return 0;
    }

    /**
     * A.5 Sampah
     */
    private function calculateScoreA5(TechnicalData $data): int
    {
        return $data->waste_collection_frequency == 'GE2X_WEEK' ? 1 : 0;
    }
}
