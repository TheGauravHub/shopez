import React from 'react';
import { SlidersHorizontal, Star } from 'lucide-react';

const SidebarFilters = ({
  selectedSort,
  onSortChange,
  selectedGender,
  onGenderChange,
  priceLimit,
  onPriceLimitChange,
  selectedRating,
  onRatingChange,
  selectedAvailability,
  onAvailabilityChange,
  selectedBrand,
  onBrandChange,
  brands = []
}) => {
  const sortOptions = [
    'Popularity',
    'Price Low to High',
    'Price High to Low',
    'Newest'
  ];

  const genderOptions = [
    { label: 'All Genders', value: 'All' },
    { label: 'Men', value: 'Men' },
    { label: 'Women', value: 'Women' },
    { label: 'Unisex', value: 'Unisex' }
  ];

  return (
    <aside className="sidebar">
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <span className="eyebrow">Smart Filters</span>
          <h2 style={{ fontSize: '22px', lineHeight: 1.1 }}>Refine</h2>
        </div>
        <SlidersHorizontal size={22} color="var(--primary)" />
      </div>

      <div className="filter-group">
        <h3>Sort By</h3>
        {sortOptions.map((option) => (
          <label key={option} className="filter-option">
            <input
              type="radio"
              name="sort"
              checked={selectedSort === option}
              onChange={() => onSortChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h3>Price Range</h3>
        <input
          type="range"
          min="10"
          max="2000"
          step="10"
          value={priceLimit}
          onChange={(e) => onPriceLimitChange(Number(e.target.value))}
          className="range-input"
          aria-label="Maximum product price"
        />
        <div className="flex-between" style={{ color: 'var(--text-muted)', fontWeight: 800, marginTop: '8px' }}>
          <span>$10</span>
          <span>Up to ${priceLimit}</span>
        </div>
      </div>

      <div className="filter-group">
        <h3>Rating</h3>
        {[4, 3, 2].map((rating) => (
          <label key={rating} className="filter-option">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {rating}+ <Star size={14} fill="var(--warning)" color="var(--warning)" />
            </span>
            <input
              type="radio"
              name="rating"
              checked={selectedRating === rating}
              onChange={() => onRatingChange(rating)}
            />
          </label>
        ))}
        <label className="filter-option">
          <span>All ratings</span>
          <input
            type="radio"
            name="rating"
            checked={selectedRating === 0}
            onChange={() => onRatingChange(0)}
          />
        </label>
      </div>

      <div className="filter-group">
        <h3>Gender</h3>
        {genderOptions.map((option) => (
          <label key={option.value} className="filter-option">
            <input
              type="radio"
              name="gender"
              checked={selectedGender === option.value}
              onChange={() => onGenderChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h3>Brand</h3>
        <label className="filter-option">
          <span>All Brands</span>
          <input
            type="radio"
            name="brand"
            checked={selectedBrand === 'All'}
            onChange={() => onBrandChange('All')}
          />
        </label>
        {brands.slice(0, 6).map((brand) => (
          <label key={brand} className="filter-option">
            <span>{brand}</span>
            <input
              type="radio"
              name="brand"
              checked={selectedBrand === brand}
              onChange={() => onBrandChange(brand)}
            />
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h3>Availability</h3>
        {['All', 'In Stock', 'Out of Stock'].map((option) => (
          <label key={option} className="filter-option">
            <span>{option}</span>
            <input
              type="radio"
              name="availability"
              checked={selectedAvailability === option}
              onChange={() => onAvailabilityChange(option)}
            />
          </label>
        ))}
      </div>
    </aside>
  );
};

export default SidebarFilters;
