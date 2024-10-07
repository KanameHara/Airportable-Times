class AddNotNullConstraintsToPosts < ActiveRecord::Migration[7.0]
  def change
    change_column_null :posts, :location, false
  end
end
