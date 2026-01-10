import { NextResponse } from "next/server"
import * as jose from "jose"
import fs from "fs"
import path from "path"

export async function GET() {
    const TEAM_ID = process.env.APPLE_TEAM_ID
    const KEY_ID = process.env.APPLE_KEY_ID || "Q6BUMM2756"

    if (!TEAM_ID) {
        return NextResponse.json({ error: "Missing APPLE_TEAM_ID environment variable" }, { status: 500 })
    }

    let privateKeyString = process.env.APPLE_PRIVATE_KEY
    if (!privateKeyString) {
        try {
            const keyPath = path.join(process.cwd(), "config", `AuthKey_${KEY_ID}.p8`)
            if (fs.existsSync(keyPath)) {
                privateKeyString = fs.readFileSync(keyPath, "utf8")
            }
        } catch (e) {
            console.error("Error reading Apple private key file:", e)
        }
    }

    if (!privateKeyString) {
        return NextResponse.json(
            { error: "Missing Apple private key (neither APPLE_PRIVATE_KEY nor .p8 file found)" },
            { status: 500 }
        )
    }

    try {
        const ecPrivateKey = await jose.importPKCS8(privateKeyString, "ES256")

        const token = await new jose.SignJWT({})
            .setProtectedHeader({ alg: "ES256", kid: KEY_ID })
            .setIssuedAt()
            .setIssuer(TEAM_ID)
            .setExpirationTime("1h")
            .sign(ecPrivateKey)

        return NextResponse.json({ token })
    } catch (e: any) {
        console.error("Error generating Apple Developer Token:", e)
        return NextResponse.json({ error: "Failed to generate token: " + e.message }, { status: 500 })
    }
}
