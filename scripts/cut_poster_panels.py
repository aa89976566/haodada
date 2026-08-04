#!/usr/bin/env python3
"""Cut hero-drive.jpg into static side panels + scrolling center.

Sides keep full CRT/keyboard by extending past the blue/yellow seam, then
paint center bleed to panel blue (#1740c0).
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public/images/hero-drive.jpg"
OUT = ROOT / "public/images"
PANEL = np.array([23, 64, 192], dtype=np.uint8)  # #1740c0
SEAM_L, SEAM_R = 628, 1772
LEFT_END, RIGHT_START = 755, 1639
PAD = 64


def keep_hardware_only(region: np.ndarray) -> np.ndarray:
    r = region[:, :, 0].astype(np.int16)
    g = region[:, :, 1].astype(np.int16)
    b = region[:, :, 2].astype(np.int16)
    luma = 0.3 * r + 0.59 * g + 0.11 * b
    beige = (
        (r >= 130)
        & (g >= 120)
        & (b >= 95)
        & (np.abs(r - g) <= 45)
        & ((r - b) >= -5)
        & (b <= 200)
        & (luma >= 125)
        & (luma <= 230)
    )
    keys = (
        (85 <= r)
        & (r <= 155)
        & (85 <= g)
        & (g <= 150)
        & (75 <= b)
        & (b <= 145)
        & (np.abs(r - g) <= 22)
        & (np.abs(g - b) <= 25)
        & ((b - r) <= 15)
        & (luma >= 90)
        & (luma <= 155)
    )
    keep = beige | keys
    out = np.broadcast_to(PANEL, region.shape).copy()
    out[keep] = region[keep]
    kept = keep.copy()
    for _ in range(2):
        dil = kept.copy()
        dil[1:, :] |= kept[:-1, :]
        dil[:-1, :] |= kept[1:, :]
        dil[:, 1:] |= kept[:, :-1]
        dil[:, :-1] |= kept[:, 1:]
        near_h = (
            (r >= 110)
            & (g >= 100)
            & (b >= 80)
            & (np.abs(r - g) <= 50)
            & ((b - r) <= 25)
            & (luma >= 105)
        )
        add = dil & ~kept & near_h
        out[add] = region[add]
        kept |= add
    return out


def snap_blues(region: np.ndarray) -> np.ndarray:
    r = region[:, :, 0].astype(np.int16)
    g = region[:, :, 1].astype(np.int16)
    b = region[:, :, 2].astype(np.int16)
    near = (np.abs(r - 23) <= 45) & (np.abs(g - 64) <= 45) & (np.abs(b - 192) <= 45)
    navy = (r <= 45) & (g <= 50) & (b <= 100)
    soft = (r <= 70) & (g >= 30) & (g <= 110) & (b >= 140) & (b <= 235)
    orange = (r >= 160) & (g <= 140) & (b <= 100)
    yellow = (r >= 180) & (g >= 145) & (b <= 145)
    hard = (r >= 120) & (g >= 110) & (b >= 90) & (np.abs(r - g) <= 50) & (b <= 205) & (
        (b - r) <= 20
    )
    mask = (near | navy | soft) & ~orange & ~yellow & ~hard
    out = region.copy()
    out[mask] = PANEL
    return out


def pad(arr: np.ndarray, pl: int, pr: int) -> np.ndarray:
    hh, ww, _ = arr.shape
    canvas = np.full((hh, ww + pl + pr, 3), PANEL, dtype=np.uint8)
    canvas[:, pl : pl + ww] = arr
    return canvas


def scrub_inner(arr: np.ndarray, from_right: bool) -> np.ndarray:
    h, w, _ = arr.shape
    r = arr[:, :, 0].astype(np.int16)
    g = arr[:, :, 1].astype(np.int16)
    b = arr[:, :, 2].astype(np.int16)
    beige = (
        (r >= 125)
        & (g >= 115)
        & (b >= 90)
        & (np.abs(r - g) <= 48)
        & ((b - r) <= 18)
        & (b <= 205)
    )
    keys = (
        (85 <= r)
        & (r <= 155)
        & (85 <= g)
        & (g <= 150)
        & (75 <= b)
        & (b <= 145)
        & (np.abs(r - g) <= 22)
        & ((b - r) <= 15)
    )
    hard = beige | keys
    band = int(w * 0.12)
    xs = range(w - band, w) if from_right else range(0, band)
    out = arr.copy()
    for x in xs:
        for y in range(h):
            if not hard[y, x]:
                out[y, x] = PANEL
    if from_right:
        out[:, -36:] = PANEL
    else:
        out[:, :36] = PANEL
    return snap_blues(out)


def save_pair(arr: np.ndarray, stem: str) -> None:
    img = Image.fromarray(arr)
    img.save(OUT / f"{stem}.jpg", quality=92, optimize=True)
    img.save(OUT / f"{stem}.webp", quality=88, method=6)
    print(stem, arr.shape[1], arr.shape[0])


def main() -> None:
    im = np.array(Image.open(SRC).convert("RGB"))
    left = im[:, :LEFT_END].copy()
    left[:, SEAM_L:] = keep_hardware_only(left[:, SEAM_L:])
    left = scrub_inner(pad(snap_blues(left), PAD, PAD), True)

    right = im[:, RIGHT_START:].copy()
    ls = SEAM_R - RIGHT_START
    right[:, :ls] = keep_hardware_only(right[:, :ls])
    right = scrub_inner(pad(snap_blues(right), PAD, PAD), False)

    center = im[:, SEAM_L:SEAM_R].copy()
    save_pair(left, "side-dog-left")
    save_pair(right, "side-dog-right")
    save_pair(center, "hero-center")


if __name__ == "__main__":
    main()
