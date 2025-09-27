FactoryBot.define do
  factory :book do
    title { Faker::Book.title }
    author { Faker::Book.author }
    genre { Faker::Book.genre }
    isbn { Faker::Code.isbn }
    total_copies { rand(1..5) }
    available_copies { total_copies }
  end
end
