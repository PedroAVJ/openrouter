---
name: video-generation
description: Prepare, submit, monitor, download, and evaluate video generations through OpenRouter's asynchronous multi-model API. Use for text-to-video, image-to-video, reference-guided video, current video-model discovery, or an existing OpenRouter video job.
---

# Generate Video Through OpenRouter

OpenRouter is the application boundary. Provider models can change; discover
their current capabilities and prices from OpenRouter immediately before every
paid request.

## Safety Boundary

`POST /api/v1/videos` can spend credits. Reading model metadata, checking a job,
or preparing a request is safe. Do not submit a generation until the user has
authorized the exact model, prompt or reference, duration, resolution or size,
audio choice, and expected cost. Never print the API key.

Publishing a private reference image to a public URL is a separate disclosure
and requires explicit authorization. Prefer an API-supported private input form
when available.

## Discover the Live Surface

Require `OPENROUTER_API_KEY` only for authenticated operations.

```bash
curl -fsSL https://openrouter.ai/api/v1/videos/models
```

Use the returned capabilities rather than remembered model names. Inspect at
least the model ID, supported durations, resolutions or sizes, aspect ratios,
frame-image support, reference-input support, audio support, and pricing SKUs.

When the key has management permission, credit totals and usage are available
through:

```bash
curl -fsSL https://openrouter.ai/api/v1/credits \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

A permissions error from this endpoint does not prove the generation key is
invalid.

## Choose the Generation Shape

- **Text-to-video:** suitable when precise identity or geometry does not need
  to survive from an existing artifact.
- **First/last-frame guidance:** use `frame_images` when the chosen model
  supports those frame types and visual continuity matters.
- **Reference-guided generation:** use `input_references` only when the current
  model metadata says the relevant reference modality is supported.

For reference-sensitive work, accept the still before generating motion. Do
not ask the video model to invent the subject, composition, camera, and motion
simultaneously when the subject must remain exact.

Keep one narrow motion or visual question per clip. State which parts may move,
which must remain invariant, the camera behavior, and explicit transformations
that would count as failure.

## Preview Before Spending

Prepare `request.json` and show the resolved request plus the model's current
pricing before asking for approval. A minimal request is:

```json
{
  "model": "provider/current-model-id",
  "prompt": "One scene and one narrow motion request",
  "duration": 4,
  "resolution": "720p",
  "generate_audio": false
}
```

Only include `frame_images`, `input_references`, `provider`, `seed`, `size`, or
`aspect_ratio` when the current model metadata supports them.

## Submit, Poll, and Download

After exact approval:

```bash
curl -fsSL -X POST https://openrouter.ai/api/v1/videos \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @request.json
```

Save the response immediately. It contains the job ID and polling URL. Poll the
returned URL until a terminal status; honor `Retry-After` and do not busy-loop.
On completion, download the first output with:

```bash
curl -fSL "https://openrouter.ai/api/v1/videos/JOB_ID/content?index=0" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  --output output.mp4
```

If the job fails, preserve the exact error and do not automatically resubmit a
paid request.

## Artifact Contract

Keep together:

- the source prompt and any private/local reference paths;
- the exact request JSON;
- model metadata and pricing used for approval;
- submit and final job responses, including reported usage or cost;
- downloaded video outputs;
- one short judgment against the single question the clip was meant to answer.

Generated video is evidence of what a model rendered, not proof of physical
comfort, mechanics, real-world safety, or events that were not actually
recorded.
