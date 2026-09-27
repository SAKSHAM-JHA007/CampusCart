// Single assert-based self-check test (Ponytail standard: zero external frameworks)
const assert = require('assert');

// 1. Discount calculation check
function calcDiscount(orig, price) {
  if (!orig || orig <= price || price <= 0) return 0;
  return Math.round(((orig - price) / orig) * 100);
}

assert.strictEqual(calcDiscount(1000, 400), 60, 'Discount should be 60%');
assert.strictEqual(calcDiscount(500, 500), 0, 'No discount when orig equals price');
assert.strictEqual(calcDiscount(0, 500), 0, 'No discount when orig is zero');
assert.strictEqual(calcDiscount(500, 0), 0, 'Donation (0 price) does not show discount');

// 2. Student auth verification check
function validateStudent(user) {
  if (!user) return false;
  const { name, email, phone, year } = user;
  if (!name || !name.trim()) return false;
  if (!email || !email.includes('@')) return false;
  if (!phone || !/^\d{10}$/.test(phone)) return false;
  if (!year) return false;
  return true;
}

assert.strictEqual(
  validateStudent({ name: 'Rahul', email: 'rahul@bmsit.in', phone: '9876543210', year: '3rd Year' }),
  true,
  'Valid student must pass verification'
);
assert.strictEqual(
  validateStudent({ name: '', email: 'rahul@bmsit.in', phone: '9876543210', year: '3rd Year' }),
  false,
  'Missing name must fail verification'
);
assert.strictEqual(
  validateStudent({ name: 'Rahul', email: 'invalid-email', phone: '9876543210', year: '3rd Year' }),
  false,
  'Invalid email must fail verification'
);
assert.strictEqual(
  validateStudent({ name: 'Rahul', email: 'rahul@bmsit.in', phone: '12345', year: '3rd Year' }),
  false,
  'Short phone must fail verification'
);

// 3. Filter check
const mockItems = [
  { id: 1, title: 'VTU Math Text', category: 'Books & Notes', price: 200 },
  { id: 2, title: 'Study Lamp', category: 'Appliances', price: 350 },
  { id: 3, title: 'Free Drafter', category: 'Lab & Drafter', price: 0 },
];

function filterItems(items, cat, search) {
  return items.filter((item) => {
    const matchCat = cat === 'all' || item.category === cat || (cat === 'Donate' && item.price === 0);
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
}

assert.strictEqual(filterItems(mockItems, 'all', '').length, 3);
assert.strictEqual(filterItems(mockItems, 'Books & Notes', '').length, 1);
assert.strictEqual(filterItems(mockItems, 'Donate', '').length, 1);
assert.strictEqual(filterItems(mockItems, 'all', 'lamp').length, 1);
assert.strictEqual(filterItems(mockItems, 'all', 'nonexistent').length, 0);

console.log('✅ [CampusCart Self-Check Passed] All core logic tests passed with 0 failures.');
