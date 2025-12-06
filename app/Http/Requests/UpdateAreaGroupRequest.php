<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAreaGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'legend_color_hex' => ['required', 'string', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/'],
            'legend_icon' => ['nullable', 'string', 'max:150'],
            'geometry_json' => ['nullable', 'array'],
            'centroid_lat' => ['nullable', 'numeric'],
            'centroid_lng' => ['nullable', 'numeric'],
        ];
    }
}