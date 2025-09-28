require 'rails_helper'

RSpec.describe User, type: :model do
  it { should define_enum_for(:role).with_values(member: 0, librarian: 1) }

  it { should validate_presence_of(:email) }
  it { should validate_uniqueness_of(:email).case_insensitive }
  it { should validate_presence_of(:name) }

  it { should have_many(:borrowings) }
end
