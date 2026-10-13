# Character origin registration

**Current runtime:** Fox’s hello uses one stationary raster head/body master and numerically anchored sleeve/palm motion. Protected head, torso and foot pixel error is zero; all24 frames share origin(256,256). The inspector defaults to this final rig. Earlier alignment methods are retained below as comparison evidence.

The earlier sheets had consistent cell dimensions, but the generated bodies were positioned differently inside their cells. The largest adjacent horizontal step was **26 pixels**. Horizontal body-origin range was **27px**; vertical range was **10.5px** across the 24-frame Fox hello clip. Equal cropping alone did not solve this.

The app now uses registered assets for all 24 Fox motion frames and the four expression poses of Fox, Nia and Orbit. Originals remain unchanged.

## Shared zero point

Every 512×512 cell uses screen origin **(256,256)**. In local mathematical coordinates that is **(0,0)**, with positive X right and positive Y upward:

`x_local = x_canvas − 256`

`y_local = 256 − y_canvas`

The four quadrants in the inspector show this convention. An atlas cell at row r and column c has global origin `(512c+256, 512r+256)`. Runtime playback crops the complete cell and never recenters from the changing silhouette.

The landmark detector uses the connected body, excluding detached alpha speckles. It measures the stationary hip/pants band, core crown and planted shoe line; Orbit uses its boot midpoint and excludes its moving antenna from the core crown. A moving hand, tail or celebration decoration cannot move the root.

For source body origin `O=(cx,(crownY+groundY)/2)` and body span `h=groundY−crownY`:

`scale s = 360/h`

`translation t = (256,256) − sO`

`p_canvas = s p_source + t`

A single inverse affine sampling pass applies uniform scale and translation. There is no rotation, limb warp, anatomy replacement or generated new motion. A final integer shift corrects raster sampling bias; the manifest stores the effective transform, calibrated source origin, measured output origin, and remaining pixel error. The continuous calibrated origin maps exactly to (256,256); raster measurement is limited by half-pixel centers.

This per-frame technical registration is explicitly requested by the user. It supersedes the earlier shared-sheet-only packing choice. It does not synthesize creative animation from transforms.

## Landmark-comparator result (earlier phase)

| Metric | Original | Registered |
|---|---:|---:|
| X origin range | 27px | 0px |
| Largest adjacent X step | 26px | 0px |
| Y origin range | 10.5px | 1px |
| Maximum Y error from shared origin | — | 0.5px |

The independently unpacked production atlas has maximum measured root error **0.5px** at 512px cell resolution. It is packed at full resolution to avoid introducing new alignment error through a 256px downsample. The display projects this error to less than one screen pixel at the current studio size.

All 12 expression PNGs measure within 0.5px of the common origin. One fixed display scale per character protects the antenna, tail and raised hands across all its poses. Expression swaps no longer add a whole-body hop or crossfade. The studio uses the same screen-space center and apparent Fox body height when switching between an expression and the hello sequence.

## Inspection and verification

Open `index.html`, or serve this directory and open its URL. The inspector provides a frame slider, play/pause, pixel grid, shared axes, measured orange crosshair, green shoe line, all expression poses, and per-frame scale/translation/error values. `frame-transforms.csv` and `registration.json` preserve the exact measurements. `anchor-drift.png`, `comparison.gif` and `aligned-contact-sheet.png` show the result.

`node tests/characterRegistration.test.cjs` checks all 36 registrations, inverse origins, uniform scales, complete-cell bounds, preserved loop endpoints, fixed display margins and runtime asset references. `python scripts/verify_character_registration.py` independently reads pixels from the committed packed atlas and 12 expression PNGs, verifies the residual, and checks that original images remain unchanged. Generation/verification tools use Pillow, NumPy and Matplotlib in the research environment; no new app runtime dependency was added.

Browser checks verify that expression and hello root centers match exactly in the studio, full-resolution atlas loading, replay, reduced motion, and inspector controls at mobile and desktop widths. Typecheck, lint and iOS/Android/web exports pass. Rams quick_review via=rules was attempted and refused because the workspace's review credits are exhausted; no approval or findings were returned.

## Remaining art variation

Registration removes accidental root/scale drift. Generated internal head, facial, clothing and limb shapes still differ between drawings. That deformation cannot be eliminated by moving a single origin; it requires better consistent artwork or a dedicated layered rig. No claim is made that these are independently rigged parts, or that all internal anatomy is identical across frames. The 24-frame clip's motion and timing remain unchanged.

## Final repair: stable raster body and joint motion

The initial registration-only result still changed internal shapes. The follow-up uses the installed [Generate 2D Assets Clean Align skill](https://github.com/Sunwood-ai-labs/generate2d-assets-clean-align) to compare direct, bounding-box and alpha-mask similarity methods, together with the existing layered-character rigging guidance. The skill is installed at `/Users/ahmedmansour/.codex/skills/generate2d-assets-clean-align`; it will be discoverable on the next turn. Its `align_bbox`, `best_shift` and `shift_image` functions were actually run on the 24-frame dataset. No new app runtime package was installed.

The comparison confirms that alignment cannot remove changing body artwork. The final hello therefore uses a **single raster body/head master** plus sleeve and palm extracted from the generated artwork. The body stays at identity transform. Shoulder pivot is **(293,255)**; wrist contact is **(358.289,219.566)**, detected from the palm-to-sleeve pixels. Source artwork remains raster; no SVG character is reconstructed.

For the shoulder S and wrist W:

`M_shoulder = T(S) R(theta_s) T(-S)`

`M_wrist = T(W) R(theta_w) T(-W)`

`p_palm = M_shoulder M_wrist p_source`

`p_sleeve = M_shoulder p_source`

`p_head/body = p_master`

The body master owns its stationary foreground pixels; moving parts render behind it. Quintic easing `6u⁵−15u⁴+10u³` gives zero first and second derivatives at phase endpoints. The wave raises, pivots at the wrist, and returns. First and last frames are byte-identical. The matching static idle PNG uses frame0, so switching into the motion does not switch its head or body artwork.

The independent production-PNG check reads all 24 cells from the actual committed atlas. **Head, torso and foot protected-region RGBA error is exactly0; the source body origin is exactly(256,256) in every frame.** It also checks master equality, unchanged idle/loop boundaries and connected limb/body pixels. `body-pixel-error.png` shows the comparison, and `method-comparison.json` preserves each alignment method's numeric error and search values. RGBA MSE measures combined placement, color, alpha and shape change; it is not a universal perceptual-quality score.

The new frames are **24 baked raster rig renders at24fps**, not24 new image-generation calls. The original 24 generated drawings and the earlier registration-only atlas are retained for inspection. The other companions' discrete expression images remain landmark-registered; this fixed-body joint rig currently covers Fox's hello. An attempted face-only crop was rejected because it included occluding hand/clothing pixels and is not shipped.

Use the **Method** selector in the inspector to compare the current rig with body-center, alpha-mask and bounding-box methods. This supersedes the earlier statement that hello retained all internal drawing variations. Browser checks confirm exact matching studio centers, all authored frames, static reduced motion and no page errors. Native and web bundles export successfully; physical-device rendering remains unverified.
