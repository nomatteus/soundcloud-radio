class StationsController < ApplicationController
  def show
  end

  def index
    client = Soundcloud2::Client.new('7f77beae3d19100f293b7647d2e6c8e5')
    @tracks = []

    if params[:q]
      q = params[:q].clone
      Rails.logger.info "q at beginning is: #{q}"

      search_params = {}

      ####### BPM ##
      bpm_match = /bpm:([\S]+)/i.match(q)
      if !bpm_match.nil?
        bpm_split = bpm_match[1].split '-'
        if bpm_split.length == 2
          # We have a range!
          search_params[:"bpm[from]"] = bpm_split[0].to_i
          search_params[:"bpm[to]"] = bpm_split[1].to_i
        elsif bpm_split.length == 1
          # No range, so use same bpm for each end of range
          search_params[:"bpm[from]"] = bpm_split[0].to_i
          search_params[:"bpm[to]"] = bpm_split[0].to_i
        end
        # Remove bpm parameter from search
        q.gsub! bpm_match[0], ""
      end

      ####### Duration ##
      ####### (query will have duration in seconds, 
      #######  soundcloud expects ms)
      duration_match = /length:([\S]+)/i.match(q)
      if !duration_match.nil?
        duration_split = duration_match[1].split '-'
        if duration_split.length == 2
          # We have a range!
          search_params[:"duration[from]"] = duration_split[0].to_i * 1000
          search_params[:"duration[to]"] = duration_split[1].to_i * 1000
        elsif duration_split.length == 1
          # No range, so use same duration for each end of range
          search_params[:"duration[from]"] = duration_split[0].to_i * 1000
          search_params[:"duration[to]"] = duration_split[0].to_i * 1000
        end
        # Remove duration parameter from search
        q.gsub! duration_match[0], ""
      end

      ####### Genres ##
      # comma-separated list of genres
      genre_match = /genres?:([\S]+)/i.match(q)
      if !genre_match.nil?
        search_params[:genres] = genre_match[1]
        # Remove genre parameter from search
        q.gsub! genre_match[0], ""
      end

      ####### Types ##
      #comma-separated list of types i.e. original, remix
      types_match = /types?:([\S]+)/i.match(q)
      if !types_match.nil?
        search_params[:types] = types_match[1]
        # Remove types parameter from search
        q.gsub! types_match[0], ""
      end

      ####### Tags ##
      #comma-separated list of tags
      tags_match = /tags?:([\S]+)/i.match(q)
      if !tags_match.nil?
        search_params[:tags] = tags_match[1]
        # Remove tags parameter from search
        q.gsub! tags_match[0], ""
      end

      ####### Order ##
      order_match = /order:([\S]+)/i.match(q)
      if !order_match.nil?
        if ["created_at", "hotness"].include? order_match[1]
          search_params[:order] = order_match[1]
        else
          search_params[:order] = "hotness"
        end
        # Remove order parameter from search
        q.gsub! order_match[0], ""
      end

      search_params[:q] = q if search_params[:q] != ""

      Rails.logger.info "q at end is: #{q}"

      @tracks = client.tracks(search_params)
    end

  end
end
