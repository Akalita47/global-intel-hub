import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CreateNewsItemInput } from '@/hooks/useNewsItems';
import { ThreatLevel, ConfidenceLevel, ActorType, SourceCredibility } from '@/types/news';

interface CreateNewsDialogProps {
  onCreate: (input: CreateNewsItemInput) => Promise<unknown>;
}

const categories = ['security', 'diplomacy', 'economy', 'conflict', 'humanitarian', 'technology'] as const;
const threatLevels: ThreatLevel[] = ['low', 'elevated', 'high', 'critical'];
const confidenceLevels: ConfidenceLevel[] = ['verified', 'developing', 'breaking'];
const actorTypes: ActorType[] = ['state', 'non-state', 'organization'];
const sourceCredibilities: SourceCredibility[] = ['high', 'medium', 'low'];
const regions = ['Europe', 'North America', 'South America', 'Asia Pacific', 'Middle East', 'Africa', 'Central Asia', 'South Asia', 'Oceania', 'Arctic', 'Caucasus'];

export function CreateNewsDialog({ onCreate }: CreateNewsDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState<CreateNewsItemInput>({
    title: '',
    summary: '',
    url: '',
    source: '',
    sourceCredibility: 'medium',
    lat: 0,
    lon: 0,
    country: '',
    region: 'Europe',
    tags: [],
    confidenceScore: 0.8,
    confidenceLevel: 'developing',
    threatLevel: 'low',
    actorType: 'organization',
    category: 'security',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onCreate(formData);
      setOpen(false);
      setFormData({
        title: '',
        summary: '',
        url: '',
        source: '',
        sourceCredibility: 'medium',
        lat: 0,
        lon: 0,
        country: '',
        region: 'Europe',
        tags: [],
        confidenceScore: 0.8,
        confidenceLevel: 'developing',
        threatLevel: 'low',
        actorType: 'organization',
        category: 'security',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="w-4 h-4" />
          Add Intel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create New Intel Report</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter headline..."
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                placeholder="Brief description of the intel..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData((prev) => ({ ...prev, source: e.target.value }))}
                placeholder="e.g., Reuters"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value as typeof formData.category }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Threat Level</Label>
              <Select
                value={formData.threatLevel}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, threatLevel: value as ThreatLevel }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {threatLevels.map((level) => (
                    <SelectItem key={level} value={level} className="capitalize">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Confidence Level</Label>
              <Select
                value={formData.confidenceLevel}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, confidenceLevel: value as ConfidenceLevel }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {confidenceLevels.map((level) => (
                    <SelectItem key={level} value={level} className="capitalize">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Actor Type</Label>
              <Select
                value={formData.actorType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, actorType: value as ActorType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actorTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Source Credibility</Label>
              <Select
                value={formData.sourceCredibility}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, sourceCredibility: value as SourceCredibility }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sourceCredibilities.map((cred) => (
                    <SelectItem key={cred} value={cred} className="capitalize">
                      {cred}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                placeholder="e.g., Germany"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Region *</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lat">Latitude *</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData((prev) => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g., 52.5200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lon">Longitude *</Label>
              <Input
                id="lon"
                type="number"
                step="any"
                value={formData.lon}
                onChange={(e) => setFormData((prev) => ({ ...prev, lon: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g., 13.4050"
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confidenceScore">Confidence Score (0-1)</Label>
              <Input
                id="confidenceScore"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.confidenceScore}
                onChange={(e) => setFormData((prev) => ({ ...prev, confidenceScore: parseFloat(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub-category</Label>
              <Input
                id="subCategory"
                value={formData.subCategory || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, subCategory: e.target.value }))}
                placeholder="e.g., Cyber Attack"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Intel'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
