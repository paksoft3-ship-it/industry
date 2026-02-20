export interface MegaMenuCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  children: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    image: string | null;
    children: {
      id: string;
      name: string;
      slug: string;
    }[];
  }[];
}
