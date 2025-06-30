import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Key, Copy, Trash2, Eye, EyeOff, Plus, ExternalLink } from "lucide-react";

const createTokenSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
  expiresAt: z.string().optional(),
});

type CreateTokenData = z.infer<typeof createTokenSchema>;

interface PersonalAccessToken {
  id: string;
  userId: string;
  token: string;
  name: string;
  permissions: string[];
  expiresAt: string | null;
  lastUsedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PersonalAccessTokens() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateTokenData>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      name: "",
      permissions: ["premium"],
      expiresAt: "",
    },
  });

  const { data: tokens = [], isLoading } = useQuery<PersonalAccessToken[]>({
    queryKey: ["/api/personal-access-tokens"],
  });

  const createTokenMutation = useMutation({
    mutationFn: async (data: CreateTokenData) => {
      const response = await apiRequest("/api/personal-access-tokens", "POST", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-access-tokens"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Personal access token created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create token",
        variant: "destructive",
      });
    },
  });

  const deleteTokenMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      const response = await apiRequest(`/api/personal-access-tokens/${tokenId}`, "DELETE");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-access-tokens"] });
      toast({
        title: "Success",
        description: "Token deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete token",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: CreateTokenData) => {
    createTokenMutation.mutate(data);
  };

  const copyToClipboard = async (token: string, tokenId: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(tokenId);
      setTimeout(() => setCopiedToken(null), 2000);
      toast({
        title: "Copied!",
        description: "Token copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy token",
        variant: "destructive",
      });
    }
  };

  const toggleTokenVisibility = (tokenId: string) => {
    setShowTokens(prev => ({
      ...prev,
      [tokenId]: !prev[tokenId]
    }));
  };

  const getTokenUrl = (token: string) => {
    return `${window.location.origin}/?token=${token}`;
  };

  const openTokenDashboard = (token: string) => {
    window.open(getTokenUrl(token), '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Personal Access Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Personal Access Tokens
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Token
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Personal Access Token</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Personal Dashboard Token" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="permissions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permissions</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value[0]} 
                            onValueChange={(value) => field.onChange([value])}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select permissions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="premium">Premium Access</SelectItem>
                              <SelectItem value="admin">Admin Access</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expires At (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createTokenMutation.isPending}>
                      {createTokenMutation.isPending ? "Creating..." : "Create Token"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Personal access tokens allow you to access your BotCentral dashboard with premium features enabled via a secure URL.
          </p>
          
          {tokens.length === 0 ? (
            <div className="text-center py-8">
              <Key className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No tokens yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first personal access token to get a secure dashboard URL.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tokens.map((token) => (
                <div 
                  key={token.id} 
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{token.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {token.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary">
                            {permission}
                          </Badge>
                        ))}
                        <Badge variant={token.isActive ? "default" : "destructive"}>
                          {token.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openTokenDashboard(token.token)}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteTokenMutation.mutate(token.id)}
                        disabled={deleteTokenMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Token:</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleTokenVisibility(token.id)}
                      >
                        {showTokens[token.id] ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
                        {showTokens[token.id] 
                          ? token.token 
                          : `${token.token.substring(0, 12)}${'•'.repeat(20)}`
                        }
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(token.token, token.id)}
                      >
                        {copiedToken === token.id ? (
                          "Copied!"
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Dashboard URL:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-muted px-3 py-2 rounded text-sm break-all overflow-hidden">
                        {getTokenUrl(token.token)}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(getTokenUrl(token.token), `url-${token.id}`)}
                        className="shrink-0"
                      >
                        {copiedToken === `url-${token.id}` ? (
                          "Copied!"
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Created: {new Date(token.createdAt).toLocaleString()}</p>
                    {token.lastUsedAt && (
                      <p>Last used: {new Date(token.lastUsedAt).toLocaleString()}</p>
                    )}
                    {token.expiresAt && (
                      <p>Expires: {new Date(token.expiresAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}