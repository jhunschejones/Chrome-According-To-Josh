class LapseCounter
  FAILED_GRADES = ["something", "nothing", "unknown", "fail"]

  # Returns number of times a card has gone from "known" to "forgotten" after it
  # was first learned.
  #
  # https://docs.ankiweb.net/deck-options.html#lapses
  def self.count(reviews)
    reviews_to_count = reviews.dup

    # We only want to count reviews after the first time a card was "learned"
    # so begin by removing the failed reviews recorded while the card was still
    # in the learning phase.
    reviews_to_count.each do |review|
      if FAILED_GRADES.include?(review["grade"])
        reviews_to_count.shift
      end
      break
    end

    # Lapses are counted when a card goes from "learned" to "forgotten", so only
    # count batches failed reviews once after a card was "known", instead of each
    # failed review in a row. See ./test/lapse_counter_test.rb for an example.
    lapses = 0
    forgotten = false
    reviews_to_count.each do |review|
      # Tracking the first time a card is "forgotten" so we that don't count multiple
      # failures in a row which should instead represent a single lapse.
      if FAILED_GRADES.include?(review["grade"]) && !forgotten
        forgotten = true
        lapses +=1
      end

      # Reset "forgotten" when card the card passed again
      if !FAILED_GRADES.include?(review["grade"]) && forgotten
        forgotten = false
      end
    end

    lapses
  end
end
