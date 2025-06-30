
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ApiKeyManagerProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  showApiKeyInput: boolean;
  setShowApiKeyInput: (show: boolean) => void;
}

export const ApiKeyManager = ({ 
  apiKey, 
  setApiKey, 
  showApiKeyInput, 
  setShowApiKeyInput 
}: ApiKeyManagerProps) => {
  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setShowApiKeyInput(false);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved locally.",
      });
    }
  };

  return (
    <>
      {/* API Key Button */}
      <Button
        onClick={() => setShowApiKeyInput(!showApiKeyInput)}
        variant="ghost"
        size="sm"
        className="mt-2 text-white hover:text-white hover:bg-white/20 border border-white/30"
      >
        <Key className="w-4 h-4 mr-2" />
        {apiKey ? 'API Key Set' : 'Set API Key'}
      </Button>

      {/* API Key Input */}
      {showApiKeyInput && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-6 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">OpenAI API Key</CardTitle>
            <p className="text-white/80 text-sm">
              Get your key from{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
              >
                platform.openai.com
              </a>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="apikey" className="text-white/90">API Key</Label>
              <Input
                id="apikey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={saveApiKey} className="flex-1 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300">
                Save Key
              </Button>
              <Button 
                onClick={() => setShowApiKeyInput(false)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-white/60">
              Your API key is stored locally in your browser and never shared.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};
