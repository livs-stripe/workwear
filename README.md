# Workwear Field Pay

A React Native (TypeScript) demo app that showcases **Stripe Terminal Tap to Pay**
for in-field uniform fitting payments. Sales reps select workwear items, then take
a contactless payment directly on the phone — no external card reader hardware.

- **App:** React Native CLI (bare workflow), `@stripe/stripe-terminal-react-native`
- **Backend:** Stripe API calls run in **Vercel serverless functions** (`/api`).
  There is **no local server** — the app talks directly to your Vercel deployment.

---

## Architecture

```
React Native app  ──POST /api/connection-token───────▶  Vercel function ──▶ Stripe
                  ──POST /api/create-payment-intent──▶  Vercel function ──▶ Stripe
```

| Path                            | Purpose                                              |
| ------------------------------- | ---------------------------------------------------- |
| `/api/connection-token.ts`      | Returns a Terminal `connectionToken` secret          |
| `/api/create-payment-intent.ts` | Creates a `card_present` PaymentIntent (AUD)          |
| `/src`                          | React Native app (screens, components, hooks)        |
| `vercel.json`                   | Minimal config; Node version pinned via `engines`    |

---

## 1. Deploy the backend to Vercel

1. Push this repo to GitHub (see bottom of this file).
2. Go to [vercel.com](https://vercel.com) → **Add New… → Project** → import the repo.
3. Vercel auto-detects the `/api` folder — no build settings needed.
4. In **Project Settings → Environment Variables**, add:

   | Name                | Value                        |
   | ------------------- | ---------------------------- |
   | `STRIPE_SECRET_KEY` | `sk_test_...` (your test key) |

5. Deploy. Your API will be live at `https://<your-project>.vercel.app`.

> All secrets live in Vercel's dashboard. There is **no `.env` file** in this repo
> and none is required.

### Verify the endpoints

```bash
curl -X POST https://<your-project>.vercel.app/api/connection-token
# => {"secret":"pst_test_..."}
```

---

## 2. Point the app at your deployment

Edit **`src/constants/config.ts`** and set your Vercel URL:

```ts
// Replace with your Vercel deployment URL
export const API_BASE_URL = 'https://your-project.vercel.app';
```

This is the **only** value you must change after deploying.

---

## 3. Run the React Native app on a device

Tap to Pay requires a **physical iPhone** (iPhone XS or newer, iOS 16.7+) with
Xcode and a paid Apple Developer account that has the *Tap to Pay on iPhone*
entitlement approved. **Tap to Pay cannot run in the iOS Simulator** — the
simulator has no NFC/proximity reader hardware.

The native `ios/` and `android/` projects are committed to this repo, so you do
not need to generate them. Install dependencies and pods:

```bash
# install JS dependencies
npm install

# iOS native deps (CocoaPods required: brew install cocoapods)
cd ios && pod install && cd ..
```

> If a package's postinstall script fails on your machine (e.g. the `esbuild`
> binary used by the `@vercel/node` dev dependency gets killed on some macOS
> setups), you can install with `npm install --ignore-scripts`. That dev tool is
> only used for local Vercel emulation and is not needed to build the app.

### Required one-time Xcode setup (needs your Apple Developer account)

The following steps require **your** Apple ID/Team and cannot be automated:

1. Open the workspace (not the `.xcodeproj`):

   ```bash
   open ios/WorkwearFieldPay.xcworkspace
   ```

2. Select the **WorkwearFieldPay** target → **Signing & Capabilities**.
3. Check **Automatically manage signing** and choose your **Team**.
4. Set a unique **Bundle Identifier** (the default is
   `org.reactjs.native.example.WorkwearFieldPay`).
5. Click **+ Capability** and add **Tap to Pay on iPhone**. This corresponds to
   the `com.apple.developer.proximity-reader.payment.acceptance` entitlement,
   which is already present in
   `ios/WorkwearFieldPay/WorkwearFieldPay.entitlements`. Your Apple Developer
   account must be approved for this entitlement by Apple.

Then run on a connected device:

```bash
npx react-native run-ios --device
```

For Android Tap to Pay, run on a supported physical device (Android with NFC,
`minSdkVersion` is set to 26):

```bash
npx react-native run-android
```

> **Note on iOS deployment target:** the Podfile pins `platform :ios, '16.0'`
> because Tap to Pay on iPhone requires iOS 16.7+.

---

## 4. Toggle simulator mode

For local testing without the Tap to Pay entitlement, use Stripe's Terminal
simulator. In **`src/constants/config.ts`**:

```ts
export const SIMULATOR_MODE = true;  // simulated reader, no hardware
// export const SIMULATOR_MODE = false; // live Tap to Pay for the demo
```

It's a one-line toggle — flip it back to `false` for the live demo.

---

## 5. Test cards

Use Stripe's Terminal test cards / simulated card presentment:

- <https://docs.stripe.com/terminal/references/testing>

When `SIMULATOR_MODE = true`, the simulated reader presents a test card
automatically when you tap **Tap to Pay**.

---

## Screens

- **ProductScreen** — grid of workwear items + custom amount + quantity stepper.
- **PaymentScreen** — order summary, reader status chip, large **Tap to Pay** button.
- **SuccessScreen** — checkmark, amount, card last 4, timestamp.
- **ErrorScreen** — error message + retry.

## Branding

`#FF6B00` Workwear orange · `#1A1A1A` dark text · white backgrounds · system sans-serif.

---

## Push to GitHub

```bash
git add .
git commit -m "Workwear Field Pay demo"
git push
```
