require 'grape'
require 'sqlite3'

module InvMap
  class API < Grape::API
    format :json

    helpers do
      def db
        @db ||= SQLite3::Database.new('db.sqlite3').tap do |db|
          db.results_as_hash = true
        end
      end
    end

    before do
      header 'Access-Control-Allow-Origin', '*'
    end

    get :areas do
      areas = []

      db.execute("SELECT * FROM areas") do |row|
        areas << row.select { |k, v| %w(id num fill_color stroke_color data comment).include?(k) }
      end

      { areas: areas }
    end

    post :areas do
      puts params.inspect
    end
  end
end

run InvMap::API
