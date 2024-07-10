import mongoose, { Document, Schema } from 'mongoose';

export interface IFxRate extends Document {
    base: string;
    counter: string;
    rate: number;
    date: Date;
}

const FxRateSchema: Schema = new Schema({
    base: { type: String, required: true },
    counter: { type: String, required: true },
    rate: { type: Number, required: true },
    date: { type: Date, required: true }
});

const FxRate = mongoose.model<IFxRate>('FxRate', FxRateSchema);

export default FxRate;
