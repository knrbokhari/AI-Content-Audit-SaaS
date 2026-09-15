/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SiteHeader } from "@/components/ui/site-header";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import { apiChangePassword } from "@/services/api";
import { toast } from "sonner";
import { User, Lock, Building, ShieldCheck, Mail, Phone } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import Description from "@/components/ui/description";

export default function ProfilePage() {
  const [currentUser] = useAtom(userAtom);
  const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const res = await apiChangePassword({ oldPassword, newPassword });
      toast.success(res?.message || "Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SiteHeader title="Profile & Settings" />
      <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
        <div
          className="flex border-b gap-6"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-semibold transition-colors relative cursor-pointer flex items-center gap-2 ${
              activeTab === "profile"
                ? "text-primary border-b-2 border-primary"
                : "text-(--text-tertiary) hover:text-primary"
            }`}
          >
            <User size={16} />
            My Profile
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 text-sm font-semibold transition-colors relative cursor-pointer flex items-center gap-2 ${
              activeTab === "settings"
                ? "text-primary border-b-2 border-primary"
                : "text-(--text-tertiary) hover:text-primary"
            }`}
          >
            <Lock size={16} />
            Settings
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar name={currentUser?.name} size="lg" />
                <div>
                  <CardTitle className="text-xl">
                    {currentUser?.name || "User Name"}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-1">
                    <ShieldCheck size={14} className="text-blue-500" />
                    <span>
                      Role:{" "}
                      <strong className="text-foreground">
                        {currentUser?.role?.name || "N/A"}
                      </strong>
                    </span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <span className="text-xs text-(--text-tertiary) font-medium flex items-center gap-1">
                    <Mail size={13} /> Email Address
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {currentUser?.email || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-(--text-tertiary) font-medium flex items-center gap-1">
                    <Phone size={13} /> Phone Number
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {currentUser?.phone || "Not provided"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-(--text-tertiary) font-medium flex items-center gap-1">
                    <Building size={13} /> Organization
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {currentUser?.organization?.name || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-(--text-tertiary) font-medium flex items-center gap-1">
                    <ShieldCheck size={13} /> System Role
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {currentUser?.role?.name || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="my-5 flex flex-wrap sm:my-8">
              <Description
                title="Change Password"
                details="Update your password to keep your account secure."
                className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
              />
              <Card className="w-full sm:w-8/12 md:w-2/3">
                <CardContent className="space-y-4 px-6 py-3">
                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-4 max-w-xl"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword">Current Password:</Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        placeholder="••••••••"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password:</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password:
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="mt-2"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
