class StationsController < ApplicationController
  def show
  end

  def index
     client = Soundcloud2::Client.new('7f77beae3d19100f293b7647d2e6c8e5')

     @tracks = client.tracks({
       :q                => params[:q] || '',
       :"bpm[from]"      => params[:bpm_from].to_i || 0, 
       :"bpm[to]"        => params[:bpm_to].to_i || 0, 
       :order            => params[:order] || "hotness",
       :"duration[from]" => params[:duration_from].to_i*60*1000 > 0 && params[:duration_from] || 2*60*1000, # ms, 1*60*1000 = 2 minute
       :"duration[to]"   => params[:duration_to].to_i*60*1000 > 0 && params[:duration_to] || 10*60*1000, # ms, 10*60*1000 = 10 minutes
       :genres           => params[:genres] || "", # comma-separated list of genres
       :types            => params[:types] || "", #comma-separated list of types i.e. original, remix
       :tags             => params[:tags] || "" #comma-separated list of tags
       }).shuffle

  end
end
