require_relative "../lib/lapse_counter"

reviews = [
  { "grade" => "unknown" },
  { "grade" => "nothing" },
  { "grade" => "nothing" },
  { "grade" => "okay" }, # learned
  { "grade" => "okay" },
  { "grade" => "okay" },
  { "grade" => "nothing" }, # lapse 1
  { "grade" => "something" }, # not re-learned yet
  { "grade" => "okay" }, # re-learned
  { "grade" => "okay" },
  { "grade" => "okay" },
  { "grade" => "nothing" }, # lapse 2
  { "grade" => "something" }, # not re-learned yet
  { "grade" => "okay" }, # re-learned
  { "grade" => "okay" },
  { "grade" => "okay" },
]

puts "TEST: LapseCounter ignores initial learning period and doesn't count multiple failed grades per lapse"
raise "⚠️ FAILURE" unless LapseCounter.count(reviews) == 2
