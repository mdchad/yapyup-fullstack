import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Alert, AlertDescription } from "@repo/ui/alert";
import { Badge } from "@repo/ui/badge";
import { Separator } from "@repo/ui/separator";
import {
  Building2,
  Users,
  Plus,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Better Auth client setup
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

// Create auth client with organization plugin
const OrganizationSignupFlow = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6"></div>
    </div>
  );
};

export default OrganizationSignupFlow;
