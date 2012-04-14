class StationsController < ApplicationController
  def show
  end

  def index
    client = Soundcloud2::Client.new('7f77beae3d19100f293b7647d2e6c8e5')

    @tracks = client.tracks({
      :q                => '', 
      :"bpm[from]"      => 0, 
      :"bpm[to]"        => 0, 
      :order            => "hotness",
      :"duration[from]" => 1*60*1000, # ms, 1*60*1000 = 1 minute
      :"duration[to]"   => 10*60*1000, # ms, 10*60*1000 = 10 minutes
      :genres           => "dubstep", # comma-separated list of genres
      :types            => "", #comma-separated list of types i.e. original, remix
      :tags             => "", #comma-separated list of tags
      }).shuffle


  end
end
