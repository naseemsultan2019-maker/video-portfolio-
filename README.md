# Nash Sultan — video portfolio

Static portfolio for GitHub Pages: [naseemsultan2019-maker.github.io/video-portfolio-](https://naseemsultan2019-maker.github.io/video-portfolio-/). There is no backend and no public edit mode. Visitors all see the same videos, from [`videos.json`](videos.json).

Preview locally with a small server (opening the file directly will not load the video list):

```bash
python3 -m http.server 8765
```

Then open `http://localhost:8765`.

## How to add a video

1. Open `videos.json`.
2. Copy one object inside the `videos` array.
3. Paste it where you want it to appear. Order in the file is order on the page.
4. Fill in the fields and save. Commit and push to `main` so GitHub Pages updates.

```json
{
  "title": "Summer offer reel",
  "description": "One or two sentences on what the piece is.",
  "category": "AI Ads & Reels",
  "tools": ["Higgsfield", "Final Cut Pro"],
  "url": "https://drive.google.com/file/d/FILE_ID/view?usp=sharing",
  "orientation": "vertical",
  "thumbnail": "",
  "showreel": false,
  "placeholder": false
}
```

| Field | What to put |
| --- | --- |
| `title` | Name of the piece. |
| `description` | A short line for the card. |
| `category` | One of the names below, spelled the same way. |
| `tools` | A list of tools, or `[]`. |
| `url` | A Google Drive share link, or a YouTube or Vimeo link. |
| `orientation` | `vertical` for 9:16, `horizontal` for 16:9. |
| `thumbnail` | Optional image path, such as `thumbs/my-piece.jpg`, or a full image URL. Leave `""` for a plain poster. |
| `showreel` | `true` on the one film that should sit in the hero. Leave it `true` on only one entry. |
| `placeholder` | `false` for real work. Sample slots use `true` and are labeled on the page. |

Categories:

- `AI Ads & Reels`
- `AI Twins & Talking Avatars`
- `Claymation & Stylized`
- `Trailers & Cinematic`
- `Brand & Explainer`

A normal Google Drive share link (`/view` or `?usp=sharing`) is enough. The page turns it into a `/preview` embed. YouTube and Vimeo links play in the same window. Other links open in a new tab.

Vertical films keep a 9:16 frame. They are not stretched into a widescreen box.

Contact links live in the `contact` object at the top of `videos.json`. Leave `upwork` or `linkedin` as `""` until you have the real URL.

## What still needs a real value

These are marked on the site. Swap them when you have the links:

- `contact.upwork` — your Upwork profile URL
- `contact.linkedin` — your LinkedIn profile URL
- Seven sample videos whose titles start with `PLACEHOLDER —` (AI ads, AI twins, claymation, trailers). Delete a slot you do not need, or replace the title, description, tools, and `url`, and set `placeholder` to `false`.

Already filled from the previous site. Change them in `videos.json` if they are out of date, and update the same email in `index.html` (the contact link and the page metadata):

- Email: `naseemsultan2019@gmail.com`
- Phone: `092411231580`
- X: [@nashpeppers4](https://x.com/nashpeppers4)

The 12 films that were saved in the old page source are already in `videos.json` (brand reels, training videos, and two occasion films). Orientations were taken from each file's preview frame. `Top From Home – Reel` had no preview frame, so it is marked `vertical` because it is a short-form reel. Change `orientation` if a frame looks wrong.

The old public edit button stored changes only in that browser, under the localStorage key `pgVideoPortfolioDataV2`. Those browser-only edits were not in the repository, so they are not on this page. Paste any missing links into `videos.json`.
