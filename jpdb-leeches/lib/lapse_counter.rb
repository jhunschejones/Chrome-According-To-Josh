class LapseCounter
  FAILED_GRADES = ["something", "nothing", "unknown"]

  # Returns number of times a card went from "known" to "forgotten" after it was
  # first learned.
  #
  # https://docs.ankiweb.net/deck-options.html#lapses
  def self.count(reviews)
    # We only want to count reviews after the first time the card was "learned"
    # so begin by removing the failed reviews while the card was still in the
    # learning phase.
    reviews.each do |review|
      if FAILED_GRADES.include?(review["grade"])
        reviews.shift
      else
        break
      end
    end

    # Lapses are counted when a card goes from "learned" to "forgotten", so only
    # count failed reviews after a card was "known", not multiple failed reviews
    # in a row.
    lapses = 0
    forgotten = false
    reviews.each do |review|
      # Track "forgotten" so we don't count multiple failures in a row
      if FAILED_GRADES.include?(review["grade"]) && !forgotten
        forgotten = true
        lapses +=1
      end

      # Reset "forgotten" when card is passed
      if !FAILED_GRADES.include?(review["grade"]) && forgotten
        forgotten = false
      end
    end

    lapses
  end
end
