require 'faker'

puts 'Seeding users…'

librarian = User.find_or_create_by!(email: 'librarian@example.com') do |u|
  u.name = 'Demo Librarian'
  u.password = 'password'
  u.role = :librarian
end

member = User.find_or_create_by!(email: 'member@example.com') do |u|
  u.name = 'Demo Member'
  u.password = 'password'
  u.role = :member
end

puts 'Seeding books…'

books = 10.times.map do
  Book.create!(
    title: Faker::Book.title,
    author: Faker::Book.author,
    genre: Faker::Book.genre,
    isbn: Faker::Code.isbn,
    total_copies: rand(2..5),
    available_copies: nil # will be set by callback
  )
end

puts 'Seeding borrowings…'

# Let the member borrow 3 books
books.sample(3).each do |book|
  Borrowing.create!(
    user: member,
    book: book
    # borrowed_at & due_at set automatically by callback
  )
end

# Optionally create an overdue borrowing:
overdue_book = books.sample
borrowing = Borrowing.create!(
  user: member,
  book: overdue_book,
  borrowed_at: 3.weeks.ago,
  due_at: 1.week.ago
)
# borrowed_at/due_at are overridden above, available_copies decremented automatically

puts 'Done!'

puts <<~MSG
  Demo users:
  - Librarian: librarian@example.com / password
  - Member: member@example.com / password

  Member already borrowed 3 books + 1 overdue.
MSG
