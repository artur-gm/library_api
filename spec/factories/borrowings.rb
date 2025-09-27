FactoryBot.define do
  factory :borrowing do
    user
    book
    borrowed_at { Time.current }
    due_at { 2.weeks.from_now }
  end
end
