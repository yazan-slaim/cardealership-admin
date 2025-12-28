"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// shadcn ui
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// icons (optional)
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    profileImageUrl: "",
    role: "agent", // UI lets user pick, API will lock to "agent" by default for safety
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending) return;

    setError("");
    setPending(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || `Signup failed (${res.status})`);
        return;
      }

      // success
      // You can auto-redirect to sign-in (and maybe prefill email)
      router.replace("/sign-in");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-[420px]">
        <CardHeader className="p-6">
          <CardTitle className="text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            Use email to create an employee account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          {!!error && (
            <div className="mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="text"
              disabled={pending}
              placeholder="Full name"
              value={form.name}
              onChange={onChange("name")}
              required
            />

            <Input
              type="email"
              disabled={pending}
              placeholder="Email"
              value={form.email}
              onChange={onChange("email")}
              required
            />

            <Input
              type="tel"
              disabled={pending}
              placeholder="Phone number (optional)"
              value={form.phoneNumber}
              onChange={onChange("phoneNumber")}
            />

            <Input
              type="text"
              disabled={pending}
              placeholder="Address (optional)"
              value={form.address}
              onChange={onChange("address")}
            />

            <Input
              type="url"
              disabled={pending}
              placeholder="Profile image URL (optional)"
              value={form.profileImageUrl}
              onChange={onChange("profileImageUrl")}
            />

            {/* Role selector (optional UI) — backend will still default to "agent" */}
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.role}
              onChange={onChange("role")}
              disabled={pending}
            >
              <option value="agent">Agent</option>
              <option value="manager">Manager</option>
              <option value="inventory">Inventory</option>
              <option value="marketing">Marketing</option>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>

            <Input
              type="password"
              disabled={pending}
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={onChange("password")}
              required
            />

            <Input
              type="password"
              disabled={pending}
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={onChange("confirmPassword")}
              required
            />

            <Button className="w-full" size="lg" disabled={pending} aria-busy={pending}>
              {pending ? "Creating…" : "Create account"}
            </Button>
          </form>

          <Separator className="my-4" />

          <div className="flex gap-3 justify-center">
            <Button
              disabled={pending}
              onClick={() => {}}
              variant="outline"
              size="lg"
              className="bg-slate-200 hover:bg-slate-300"
              title="Sign up with Google"
            >
              <FcGoogle className="size-6" />
            </Button>
            <Button
              disabled={pending}
              onClick={() => {}}
              variant="outline"
              size="lg"
              className="bg-slate-200 hover:bg-slate-300"
              title="Sign up with GitHub"
            >
              <FaGithub className="size-6" />
            </Button>
          </div>

          <p className="text-center text-sm mt-3 text-muted-foreground">
            Already have an account?{" "}
            <Link className="text-sky-600 hover:underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
