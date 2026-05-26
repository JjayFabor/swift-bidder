<?php

namespace App\Http\Requests;

use App\Rules\ValidAuctionTimes;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAuctionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'starting_price' => 'required|numeric|min:1',
            'start_time' => ['required', 'date', new ValidAuctionTimes],
            'end_time' => ['required', 'date', new ValidAuctionTimes],
            'status' => 'required|in:pending,active,cancelled,closed',
        ];
    }
}
