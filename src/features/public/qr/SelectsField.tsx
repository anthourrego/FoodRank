import { useEffect, useState } from 'react';
import { ChevronDown, MapPin, User, Calendar, Send } from 'lucide-react';
import { useProductsEvents } from '../hooks/useProductsEvent';
import type { IDataQr } from './GenerateQr';

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
    placeholder: string;
    icon: React.ComponentType<{ className?: string }>;
    gradientFrom: string;
    gradientTo: string;
}

interface SelectsFieldProps {
    generateQr: (val: IDataQr) => void
}

export default function SelectsField({ generateQr }: SelectsFieldProps) {
    const { productsEvents } = useProductsEvents();

    const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [selectedBranch, setSelectedBranch] = useState<string>('');

    const [restaurantesSelect, setRestaurantesSelect] = useState<Option[]>([]);
    const [branchsRestaurantSelect, setBranchsRestaurantSelect] = useState<Option[]>([]);

    useEffect(() => {
        if (productsEvents.length) {
            const restaurants: Option[] = productsEvents.map(it => {
                return {
                    label: it.restaurant_product.restaurant.name,
                    value: it.restaurant_product.restaurant.id + ""
                }
            })
            setRestaurantesSelect(restaurants)
        }
    }, [productsEvents])

    useEffect(() => {
        if (selectedRestaurant) {
            const restaurantFind = productsEvents.find(it => it.restaurant_product.restaurant_id + "" == selectedRestaurant)
            if (restaurantFind) {
                const branchs: Option[] = restaurantFind.branchs_product.map(it => {
                    return {
                        label: it.branch.address,
                        value: it.branch.id + ""
                    }
                })
                setBranchsRestaurantSelect(branchs)

                setSelectedEventId(restaurantFind.event_id + "")
                setSelectedProductId(restaurantFind.product_id + "")
            }
        }
    }, [selectedRestaurant])

    const SelectField: React.FC<SelectFieldProps> = ({
        label,
        value,
        onChange,
        options,
        placeholder,
        icon: Icon,
        gradientFrom,
        gradientTo
    }) => (
        <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative flex gap-4">
                <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl opacity-0 transition-opacity duration-300`}></div>
                <div className="relative bg-white border-2 border-gray-200 rounded-xl focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-300 shadow-sm">
                    <div className="flex items-center px-4 py-3">
                        <Icon className="h-5 w-5 text-gray-400 mr-3" />
                        <select
                            value={value}
                            onChange={onChange}
                            className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="">{placeholder}</option>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="via-blue-50 to-indigo-100 mb-5">
            <div className="max-w-4xl mx-auto">
                <div className='flex items-end gap-4'>
                    <SelectField
                        label="Restaurantes"
                        value={selectedRestaurant}
                        onChange={(e) => setSelectedRestaurant(e.target.value)}
                        options={restaurantesSelect}
                        placeholder="Selecciona restaurante"
                        icon={MapPin}
                        gradientFrom="from-emerald-400"
                        gradientTo="to-cyan-400"
                    />

                    <SelectField
                        label="Sucursal"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        options={branchsRestaurantSelect}
                        placeholder="Elige sucursal"
                        icon={User}
                        gradientFrom="from-purple-400"
                        gradientTo="to-pink-400"
                    />

                    <div>
                        <button
                            onClick={() => {
                                console.log({
                                    branch_id: selectedBranch,
                                    product_id: selectedProductId,
                                    event_id: selectedEventId
                                })
                                generateQr({
                                    branch_id: selectedBranch,
                                    product_id: selectedProductId,
                                    event_id: selectedEventId
                                })
                            }}
                            className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 cursor-pointer"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}