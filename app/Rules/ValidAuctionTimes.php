<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidAuctionTimes implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $start_time = request('start_time');
        $end_time = request('end_time');

        if (strtotime($start_time) < strtotime(now())) {
            $fail('The start time must be in the future.');
        }

        if (strtotime($end_time) <= strtotime($start_time)) {
            $fail('The end time must be after the start time.');
        }
    }
}
