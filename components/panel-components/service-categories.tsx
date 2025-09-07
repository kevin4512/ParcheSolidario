import { Card } from "@/components/ui/card"

interface ServiceCategory {
  id: string
  name: string
  icon: string
  description: string
  color: string
}

const categories: ServiceCategory[] = [
  {
    id: "eventos",
    name: "Eventos",
    icon: "🎉",
    description: "Participa en eventos comunitarios",
    color: "bg-blue-500 text-white",
  },
  {
    id: "delegados",
    name: "Delegados",
    icon: "🏛️",
    description: "Servicios gubernamentales",
    color: "bg-orange-500 text-white",
  },
  {
    id: "carreteras",
    name: "Carreteras y vías",
    icon: "🛣️",
    description: "Reporta problemas viales",
    color: "bg-purple-600 text-white",
  },
  {
    id: "voluntariado",
    name: "Voluntariado",
    icon: "🤝",
    description: "Únete como voluntario",
    color: "bg-orange-500 text-white",
  },
]

interface ServiceCategoriesProps {
  expanded?: boolean
}

export function ServiceCategories({ expanded = false }: ServiceCategoriesProps) {
  if (expanded) {
    return (
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id} className="p-6 hover:shadow-lg transition-all cursor-pointer border-0 shadow-md">
            <div className="flex items-center gap-6">
              <div
                className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center text-2xl shadow-md`}
              >
                {category.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-card-foreground mb-1">{category.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{category.description}</p>
              </div>
              <div className="text-primary text-xl">→</div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 text-card-foreground">¿Cómo deseas ayudar?</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="p-6 text-center hover:shadow-lg transition-all cursor-pointer border-0 shadow-md"
          >
            <div
              className={`w-16 h-16 mx-auto rounded-2xl ${category.color} flex items-center justify-center text-2xl mb-4 shadow-md`}
            >
              {category.icon}
            </div>
            <p className="font-semibold text-card-foreground leading-tight">{category.name}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
