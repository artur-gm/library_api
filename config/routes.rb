Rails.application.routes.draw do
  devise_for :users,
             defaults: { format: :json },
             controllers: {
               sessions: "users/sessions",
               registrations: "users/registrations"
             }
  namespace :admin do
    post :librarians, to: "librarians#create"
  end
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      get "/current_user", to: "users#current"
      resources :books
      resources :borrowings, only: %i[index create show] do
        member do
          post :return
        end
      end
      get "dashboard", to: "dashboards#show"
    end
  end
end
