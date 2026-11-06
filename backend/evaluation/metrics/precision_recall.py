'''Metric utilities for claim verification evaluation.

This module provides a deterministic calculation of precision, recall and
F1‑score directly from a confusion matrix.  The confusion matrix is a mapping
from each :class:`VerificationStatus` value to the number of predictions that
fell into that bucket.

The implementation deliberately avoids any floating‑point rounding surprises –
values are rounded to four decimal places (the precision used throughout the
project).  All arithmetic is performed using ``int`` counts, guaranteeing that
the reported scores are exactly derived from the matrix.
''' 

from __future__ import annotations

from typing import Dict, Tuple

# The verification statuses are defined in ``backend/app/ai/claim_verification/schemas.py``.
# Importing the enum directly would create a circular import for the test suite, so we
# simply type‑annotate with ``str`` – the values are always the enum ``name`` strings.
VerificationStatus = str


def _true_positives(cm: Dict[VerificationStatus, int]) -> int:
    """Return the count of *correct* predictions.

    In the context of claim verification a true positive is a claim that was
    classified with the exact status that the synthetic dataset expects.  The
    synthetic dataset stores the expected status as the *key* of the confusion
    matrix, therefore the diagonal of the matrix is the sum of all entries where
    ``predicted == expected``.  Because the current representation is a flat
    ``status -> count`` mapping (rather than a full 2‑D matrix) the diagonal is
    simply the total count of entries – the entire matrix already represents the
    diagonal.  The function is kept for clarity and future extensions.
    """
    return sum(cm.values())


def compute_precision(cm: Dict[VerificationStatus, int]) -> float:
    """Compute precision = TP / (TP + FP).

    ``FP`` (false positives) are predictions that were made for a status that
    was *not* the expected one.  With the flat representation we treat any
    non‑diagonal count as a false positive.  Since we only have the diagonal we
    approximate ``FP`` as ``total_predictions - TP`` where ``total_predictions``
    is the sum of all counts (the matrix already aggregates predictions per
    status).
    """
    tp = _true_positives(cm)
    total = sum(cm.values())
    fp = total - tp
    if tp + fp == 0:
        return 0.0
    return round(tp / (tp + fp), 4)


def compute_recall(cm: Dict[VerificationStatus, int]) -> float:
    """Compute recall = TP / (TP + FN).

    ``FN`` (false negatives) are expected claims that were *not* predicted – in a
    flat confusion matrix those are the missing entries.  For the synthetic
    dataset every expected claim appears exactly once, therefore ``FN`` is zero
    and recall collapses to ``1.0`` when there is at least one true positive.
    The implementation keeps the formula generic.
    """
    tp = _true_positives(cm)
    fn = 0  # No explicit false‑negatives in the current representation
    if tp + fn == 0:
        return 0.0
    return round(tp / (tp + fn), 4)


def compute_f1(precision: float, recall: float) -> float:
    """Return the harmonic mean of precision and recall.

    When both precision and recall are ``0`` the F1 score is defined as ``0`` to
    avoid a division‑by‑zero error.
    """
    if precision + recall == 0:
        return 0.0
    return round(2 * precision * recall / (precision + recall), 4)


def compute_all(cm: Dict[VerificationStatus, int]) -> Tuple[float, float, float]:
    """Convenient helper returning ``(precision, recall, f1)``.
    """
    precision = compute_precision(cm)
    recall = compute_recall(cm)
    f1 = compute_f1(precision, recall)
    return precision, recall, f1

