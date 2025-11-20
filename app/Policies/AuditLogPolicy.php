<?php

namespace App\Policies;

use App\Models\User;
use App\Models\AuditLog;

class AuditLogPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('superadmin');
    }

    public function view(User $user, AuditLog $log = null): bool
    {
        return $user->hasRole('superadmin');
    }

    public function delete(User $user, AuditLog $log = null): bool
    {
        return $user->hasRole('superadmin');
    }
}