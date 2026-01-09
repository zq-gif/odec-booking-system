import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

export default function EquipmentSelector({ selectedEquipment = [], onEquipmentChange }) {
    const [equipment, setEquipment] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState(selectedEquipment);

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            const response = await axios.get('/api/equipment');
            setEquipment(response.data);
        } catch (error) {
            console.error('Error fetching equipment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (equipmentId, change) => {
        const currentItem = selectedItems.find(item => item.id === equipmentId);
        const currentQuantity = currentItem ? currentItem.quantity : 0;
        const newQuantity = Math.max(0, currentQuantity + change);

        let updatedItems;
        if (newQuantity === 0) {
            updatedItems = selectedItems.filter(item => item.id !== equipmentId);
        } else {
            if (currentItem) {
                updatedItems = selectedItems.map(item =>
                    item.id === equipmentId ? { ...item, quantity: newQuantity } : item
                );
            } else {
                updatedItems = [...selectedItems, { id: equipmentId, quantity: newQuantity }];
            }
        }

        setSelectedItems(updatedItems);
        onEquipmentChange(updatedItems);
    };

    const getQuantity = (equipmentId) => {
        const item = selectedItems.find(item => item.id === equipmentId);
        return item ? item.quantity : 0;
    };

    const calculateEquipmentTotal = () => {
        let total = 0;
        selectedItems.forEach(selectedItem => {
            // Find equipment in all categories
            Object.values(equipment).forEach(categoryItems => {
                const equipmentItem = categoryItems.find(e => e.id === selectedItem.id);
                if (equipmentItem) {
                    total += equipmentItem.price_per_unit * selectedItem.quantity;
                }
            });
        });
        return total;
    };

    const categoryLabels = {
        bbq: 'BBQ Equipment',
        water_sports: 'Water Sports Equipment',
        audio: 'Audio Equipment',
        seating: 'Seating',
        other: 'Other Equipment'
    };

    if (loading) {
        return <div className="text-center py-4">Loading equipment...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Equipment (Optional)</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Enhance your booking with additional equipment and services.
                </p>
            </div>

            {Object.entries(equipment).map(([category, items]) => (
                <div key={category} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-orange-50 px-4 py-3 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-900">{categoryLabels[category]}</h4>
                    </div>
                    <div className="p-4 space-y-3">
                        {items.map((item) => {
                            const quantity = getQuantity(item.id);
                            return (
                                <div
                                    key={item.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                                        quantity > 0
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                        <p className="text-sm font-semibold text-orange-600 mt-1">
                                            RM {parseFloat(item.price_per_unit).toFixed(2)} per unit
                                        </p>
                                        {item.quantity_available && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Available: {item.quantity_available}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-3 ml-4">
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                            disabled={quantity === 0}
                                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <MinusIcon className="h-4 w-4 text-gray-600" />
                                        </button>
                                        <span className="text-lg font-semibold text-gray-900 w-8 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                            disabled={quantity >= item.quantity_available}
                                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <PlusIcon className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {selectedItems.length > 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Equipment Total:</span>
                        <span className="text-lg font-bold text-blue-600">
                            RM {calculateEquipmentTotal().toFixed(2)}
                        </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                        {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                    </p>
                </div>
            )}
        </div>
    );
}
