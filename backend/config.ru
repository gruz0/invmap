require 'grape'
require 'sqlite3'

module InvMap
  class API < Grape::API
    format :json

    helpers do
      def db
        @db ||= SQLite3::Database.new 'db.sqlite3'
      end
    end

    get :areas do
      areas = []

      db.execute("SELECT * FROM areas") do |row|
        areas << row
      end

      { areas: areas }
    end

    post :areas do
      puts params.inspect
    end
  end
end

run InvMap::API
