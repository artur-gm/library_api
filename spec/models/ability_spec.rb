require 'rails_helper'

RSpec.describe Ability, type: :model do
  subject(:ability) { Ability.new(user) }

  context 'librarian' do
    let(:user) { build(:user, :librarian) }
    it 'allows managing books' do
      expect(ability.can?(:manage, Book.new)).to be true
    end
  end

  context 'member' do
    let(:user) { build(:user) }
    it 'prevents managing books' do
      expect(ability.can?(:manage, Book.new)).to be false
    end
  end
end
