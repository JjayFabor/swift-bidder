<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Auction>
 */
class AuctionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startingPrice = $this->faker->randomFloat(2, 100, 100000);

        return [
            'title' => $this->faker->randomElement([
                'Vintage Rolex Watch',
                'Rare Comic Book Collection',
                'Signed Basketball Jersey',
                'Antique Wooden Cabinet',
                'Luxury Handbag from Louis Vuitton',
                'Limited Edition Sneakers',
                'Gold Coin Set',
                'Diamond Ring',
                'Original Oil Painting',
                'Collector’s Edition Guitar',
            ]),
            'description' => $this->faker->sentence(12),
            'starting_price' => $startingPrice,
            'current_price' => $this->faker->randomFloat(2, $startingPrice, $startingPrice * 1.5),
            'start_time' => $this->faker->dateTimeBetween('-1 week', '+1 week'),
            'end_time' => $this->faker->dateTimeBetween('+1 week', '+2 weeks'),
            'status' => $this->faker->randomElement(['pending', 'active', 'closed', 'cancelled']),
        ];
    }
}
