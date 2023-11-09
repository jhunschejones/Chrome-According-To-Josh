require_relative "../lib/lapse_counter"
require_relative "../lib/string_utils"

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
test_name = "LapseCounter ignores initial learning period and doesn't count multiple failed grades per lapse"

if LapseCounter.count(reviews) == 2
  puts "PASS: #{test_name}".green
else
  puts "FAIL: #{test_name}".red
end
