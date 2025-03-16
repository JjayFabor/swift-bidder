import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon,  ClockIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export function DateTimePicker ({ value, onChange }) {
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
    const [time, setTime] = useState(value ? format(new Date(value), 'HH:mm') : '');
    const [isOpen, setIsOpen] = useState(false);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        updateDateTime(date, time);
        setIsOpen(false);
    }

    const handleTimeChange = (e) => {
        setTime(e.target.value);
        updateDateTime(selectedDate, e.target.value);
    }

    const updateDateTime = (date, time) => {
        if (date && time) {
            const [hours, minutes] = time.split(':');
            const newDate = new Date(date);
            newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
            onChange(format(newDate, "yyyy-MM-dd HH:mm:ss"));
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {/* Date Picker */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            {/* Time Picker */}
            <div className="relative">
                <Input
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                    className="pl-10"
                    onBlur={() => setIsOpen(false)}
                />
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
        </div>
    );
}
