import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { MenuCategory, MenuItem } from '../../models';
import { MenuCategoryCountPipe } from '../../pipes/pipes';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule, TitleCasePipe, MenuCategoryCountPipe],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class MenuComponent {
  rs = inject(RestaurantService);

  searchTerm   = signal('');
  filterCat    = signal<MenuCategory | 'all'>('all');
  filterAvail  = signal<'all' | 'available' | 'unavailable'>('all');
  showAddForm  = signal(false);

  categories: (MenuCategory | 'all')[] = ['all','appetizer','main','dessert','beverage','special'];
  availOptions: ('all' | 'available' | 'unavailable')[] = ['all', 'available', 'unavailable'];
  categoryIcons: Record<string, string> = {
    all:'🍽️', appetizer:'🥗', main:'🍛', dessert:'🍮', beverage:'🥤', special:'⭐'
  };

  setFilterAvail(opt: 'all' | 'available' | 'unavailable') {
    this.filterAvail.set(opt);
  }

  newItem = signal({
    name:'', description:'', price:0, category:'main' as MenuCategory,
    image:'🍽️', preparationTime:15, tags:'', calories:0
  });

  filteredMenu = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const cat  = this.filterCat();
    const avail = this.filterAvail();
    return this.rs.menuItems()
      .filter(m => {
        const matchSearch = !term || m.name.toLowerCase().includes(term) || m.description.toLowerCase().includes(term) || m.tags.some(t => t.includes(term));
        const matchCat    = cat === 'all' || m.category === cat;
        const matchAvail  = avail === 'all' || (avail === 'available' ? m.available : !m.available);
        return matchSearch && matchCat && matchAvail;
      })
      .sort((a, b) => b.rating - a.rating);
  });

  groupedByCategory = computed(() => {
    const groups: Record<string, MenuItem[]> = {};
    this.filteredMenu().forEach(m => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    });
    return groups;
  });

  categoryKeys = computed(() => Object.keys(this.groupedByCategory()));

  patchNew(key: string, value: unknown) {
    this.newItem.update(f => ({ ...f, [key]: value }));
  }

  submitNew() {
    const f = this.newItem();
    if (!f.name || !f.price) {
      this.rs.addNotification('Name and price are required', 'error');
      return;
    }
    this.rs.addMenuItem({
      name: f.name, description: f.description, price: +f.price,
      category: f.category, image: f.image || '🍽️',
      available: true, preparationTime: +f.preparationTime,
      tags: f.tags.split(',').map(t => t.trim()).filter(Boolean),
      calories: +f.calories, rating: 0, reviewCount: 0,
    });
    this.showAddForm.set(false);
    this.newItem.set({ name:'', description:'', price:0, category:'main', image:'🍽️', preparationTime:15, tags:'', calories:0 });
  }

  starArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }
}
