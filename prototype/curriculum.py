"""
Alberta Grade 4 Math Curriculum Concepts
"""

CONCEPTS = {
    "multiplication_equal_groups": {
        "id": "multiplication_equal_groups",
        "title": "Multiplication: Equal Groups",
        "strand": "Number",
        "prerequisite_ids": [],
        "big_idea": "Multiplication counts equal groups faster than adding one by one.",
        "key_facts": ["2x", "3x", "4x", "5x"],
        "mnemonic_anchors": {
            "3x4=12": "3 alien spaceships each carrying 4 moon rocks",
            "4x5=20": "4 pizza boxes each with 5 slices at the robot party",
            "3x6=18": "3 dragons each breathing 6 fireballs at the ice castle",
        },
    },
    "multiplication_arrays": {
        "id": "multiplication_arrays",
        "title": "Multiplication: Arrays",
        "strand": "Number",
        "prerequisite_ids": ["multiplication_equal_groups"],
        "big_idea": "Arrays show multiplication as rows and columns — and flipping them proves 3x4 = 4x3.",
        "key_facts": [],
        "mnemonic_anchors": {
            "3x4=4x3": "a treasure chest grid: 3 rows of 4 gems or 4 rows of 3 gems — same gold!",
        },
    },
    "multiplication_commutative": {
        "id": "multiplication_commutative",
        "title": "Multiplication: Commutative Property",
        "strand": "Number",
        "prerequisite_ids": ["multiplication_arrays"],
        "big_idea": "You can multiply numbers in any order and always get the same answer.",
        "key_facts": [],
        "mnemonic_anchors": {
            "6x7=7x6": "6 rows of 7 starfish or 7 rows of 6 starfish — same beach!",
        },
    },
    "multiplication_facts_to_9x9": {
        "id": "multiplication_facts_to_9x9",
        "title": "Multiplication Facts to 9×9",
        "strand": "Number",
        "prerequisite_ids": ["multiplication_commutative"],
        "big_idea": "Knowing your multiplication facts to 9×9 unlocks all of math.",
        "key_facts": ["6x", "7x", "8x", "9x"],
        "mnemonic_anchors": {
            "6x8=48": "6 octopuses each hugging 8 balloons at the underwater party",
            "7x7=49": "7 wizard hats each holding 7 magic wands in the tower",
            "8x9=72": "8 rockets each carrying 9 astronauts to the moon base",
        },
    },
    "division_sharing": {
        "id": "division_sharing",
        "title": "Division: Sharing Equally",
        "strand": "Number",
        "prerequisite_ids": ["multiplication_equal_groups"],
        "big_idea": "Division splits a total into equal groups — it's the opposite of multiplication.",
        "key_facts": [],
        "mnemonic_anchors": {
            "12÷3=4": "12 cookies shared equally among 3 dragons — 4 each!",
        },
    },
    "division_grouping": {
        "id": "division_grouping",
        "title": "Division: Grouping",
        "strand": "Number",
        "prerequisite_ids": ["division_sharing"],
        "big_idea": "Division can also ask: how many groups of this size fit into the total?",
        "key_facts": [],
        "mnemonic_anchors": {
            "20÷5=4": "20 rockets grouped into teams of 5 — makes exactly 4 teams!",
        },
    },
    "division_fact_families": {
        "id": "division_fact_families",
        "title": "Division: Fact Families",
        "strand": "Number",
        "prerequisite_ids": ["division_grouping"],
        "big_idea": "Multiplication and division fact families show how numbers are related.",
        "key_facts": [],
        "mnemonic_anchors": {
            "3x4=12, 12÷3=4": "the same 12 moon rocks in one family: multiply or divide!",
        },
    },
    "fractions_equal_parts": {
        "id": "fractions_equal_parts",
        "title": "Fractions: Equal Parts of a Whole",
        "strand": "Number",
        "prerequisite_ids": [],
        "big_idea": "A fraction names equal parts of a whole — each part must be the same size.",
        "key_facts": [],
        "mnemonic_anchors": {
            "1/2": "one half of a giant enchanted pizza — perfectly sliced by a wizard",
        },
    },
    "fractions_naming": {
        "id": "fractions_naming",
        "title": "Fractions: Naming and Writing",
        "strand": "Number",
        "prerequisite_ids": ["fractions_equal_parts"],
        "big_idea": "The numerator tells how many parts you have; the denominator tells how many equal parts in the whole.",
        "key_facts": [],
        "mnemonic_anchors": {
            "3/4": "3 of 4 treasure chest doors open — the bottom number is how many doors total",
        },
    },
    "fractions_number_line": {
        "id": "fractions_number_line",
        "title": "Fractions on a Number Line",
        "strand": "Number",
        "prerequisite_ids": ["fractions_naming"],
        "big_idea": "Fractions live between whole numbers on the number line — each jump is an equal step.",
        "key_facts": [],
        "mnemonic_anchors": {
            "1/4 on number line": "a tiny explorer jumping exactly 1/4 of the way from 0 to 1",
        },
    },
    "place_value_thousands": {
        "id": "place_value_thousands",
        "title": "Place Value to 10,000",
        "strand": "Number",
        "prerequisite_ids": [],
        "big_idea": "Each digit's position tells its value — thousands, hundreds, tens, ones.",
        "key_facts": [],
        "mnemonic_anchors": {
            "1,234": "a castle with 1 tower, 2 flags, 3 windows, and 4 doors — each level is 10 times bigger!",
        },
    },
    "patterns_increasing": {
        "id": "patterns_increasing",
        "title": "Increasing Patterns",
        "strand": "Patterns",
        "prerequisite_ids": [],
        "big_idea": "Increasing patterns grow by a rule — find the rule and you can predict any term.",
        "key_facts": [],
        "mnemonic_anchors": {
            "2,4,6,8": "a staircase of glowing crystals that doubles each step — the pattern never lies!",
        },
    },
}
