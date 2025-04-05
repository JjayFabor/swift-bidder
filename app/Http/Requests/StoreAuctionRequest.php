<?php

namespace App\Http\Requests;

use App\Rules\ValidAuctionTimes;
use Illuminate\Foundation\Http\FormRequest;

class StoreAuctionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'starting_price' => 'required|numeric|min:1',
            'start_time' => ['required', 'date', new ValidAuctionTimes],
            'end_time' => ['required', 'date', new ValidAuctionTimes],
            'status' => 'required|in:pending,active,cancelled,closed',
            // Multiple images
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            // Video file
            'video_path' => 'nullable|mimes:mp4,mov,avi|max:10240',
        ];
    }
}
