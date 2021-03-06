"""
Grades related signals.
"""
from django.dispatch import Signal


# Signal that indicates that a user's score for a problem has been updated.
# This signal is generated when a scoring event occurs either within the core
# platform or in the Submissions module. Note that this signal will be triggered
# regardless of the new and previous values of the score (i.e. it may be the
# case that this signal is generated when a user re-attempts a problem but
# receives the same score).
PROBLEM_SCORE_CHANGED = Signal(
    providing_args=[
        'user_id',  # Integer User ID
        'course_id',  # Unicode string representing the course
        'usage_id',  # Unicode string indicating the courseware instance
        'points_earned',   # Score obtained by the user
        'points_possible',  # Maximum score available for the exercise
        'only_if_higher',   # Boolean indicating whether updates should be
                            # made only if the new score is higher than previous.
    ]
)


# Signal that indicates that a user's score for a problem has been published
# for possible persistence and update.  Typically, most clients should listen
# to the PROBLEM_SCORE_CHANGED signal instead, since that is signalled only after the
# problem's score is changed.
SCORE_PUBLISHED = Signal(
    providing_args=[
        'block',  # Course block object
        'user',   # User object
        'raw_earned',    # Score obtained by the user
        'raw_possible',  # Maximum score available for the exercise
        'only_if_higher',   # Boolean indicating whether updates should be
                            # made only if the new score is higher than previous.
    ]
)


# Signal that indicates that a user's score for a subsection has been updated.
# This is a downstream signal of PROBLEM_SCORE_CHANGED sent for each affected containing
# subsection.
SUBSECTION_SCORE_CHANGED = Signal(
    providing_args=[
        'course',  # Course object
        'course_structure',  # BlockStructure object
        'user',  # User object
        'subsection_grade',  # SubsectionGrade object
    ]
)
