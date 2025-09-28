class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new(role: :member)

    if user.librarian?
      librarian_abilities(user)
    elsif user.member?
      member_abilities(user)
    else
      guest_abilities
    end
  end

  private

  def librarian_abilities(user)
    # Book management
    can :manage, Book

    can :create, User, role: "librarian"

    # Borrowing management
    can :manage, Borrowing
    can :return, Borrowing

    # Dashboard access
    can :librarian_dashboard, User
    can :read, User # Librarians can view member profiles

    # Reports and analytics
    can :read, :reports
  end

  def member_abilities(user)
    # Book viewing and searching
    can :read, Book
    can :search, Book

    # Borrowing management (only their own)
    can :create, Borrowing
    can :read, Borrowing, user_id: user.id
    can :return, Borrowing, user_id: user.id

    # Dashboard access
    can :member_dashboard, User, id: user.id

    # Cannot manage books
    cannot [ :create, :update, :destroy ], Book
    cannot :read, User # Members cannot view other users
  end

  def guest_abilities
    # Guests can only view books (read-only access)
    can :read, Book
    can :search, Book
    cannot :create, Borrowing
  end
end
