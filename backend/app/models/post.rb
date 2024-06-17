class Post < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_many :post_images, class_name: 'PostImage', dependent: :destroy

  validates :user_id, presence: true
  validates :airport_id, presence: true
  validates :category_id, presence: true
  validates :title, presence: true
  validates :taking_at, presence: true
  validates :location, presence: true
  validates :taking_position_latitude, presence: true
  validates :taking_position_longitude, presence: true
end