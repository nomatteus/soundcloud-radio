# A "Station" is a collection of soundcloud search parameters.
# 
class Station < ActiveRecord::Base
  attr_accessible :name, :search
end



# THis is an example of what's returned for a track
=begin
key: kind, value: track
key: id, value: 222732
key: created_at, value: 2009/04/12 10:44:12 +0000
key: user_id, value: 36572
key: duration, value: 309289
key: commentable, value: true
key: state, value: finished
key: original_content_size, value: 13249851
key: sharing, value: public
key: tag_list, value:
key: permalink, value: hotwire-ss-jancrow
key: description, value: My First 12 on Formation as Hotwire with SS
key: streamable, value: true
key: downloadable, value: false
key: genre, value:
key: release, value:
key: purchase_url, value:
key: purchase_title, value:
key: label_id, value:
key: label_name, value:
key: isrc, value:
key: video_url, value:
key: track_type, value:
key: key_signature, value:
key: bpm, value: 175.0
key: title, value: Hotwire&ss jancrow
key: release_year, value:
key: release_month, value:
key: release_day, value:
key: original_format, value: mp3
key: license, value: all-rights-reserved
key: uri, value: https://api.soundcloud.com/tracks/222732
key: permalink_url, value: http://soundcloud.com/danhotwire/hotwire-ss-jancrow
key: artwork_url, value: https://i1.sndcdn.com/artworks-000011369482-qbejyf-large.jpg?ef56891
key: waveform_url, value: https://w1.sndcdn.com/8twRRci8pQ8I_m.png
key: user, value: <#Hashie::Mash avatar_url="https://i1.sndcdn.com/avatars-000003634283-3gs2id-large.jpg?ef56891" id=36572 kind="user" permalink="danhotwire" permalink_url="http://soundcloud.com/danhotwire" uri="https://api.soundcloud.com/users/36572" username="dan hotwire">
key: stream_url, value: https://api.soundcloud.com/tracks/222732/stream
key: playback_count, value: 22
key: download_count, value: 3
key: favoritings_count, value: 0
key: comment_count, value: 1
key: attachments_uri, value: https://api.soundcloud.com/tracks/222732/attachments
=end
