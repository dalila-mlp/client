<script lang="ts">
    import SelectModel from "../../components/upload/SelectModel.svelte";
    import UploadedItem from "../../components/upload/UploadedItem.svelte";

    let modelOptions: Array<string> = [
        "Convolutional neural network",
        "Decision Tree",
        "K-Nearest Neighbors",
        "Long Short-Term Memory",
        "Naive Bayes",
        "Neural Network",
        "Random Forest",
        "Recurrent Neural Network",
        "Support Vector Machine",
        "XGBoost",
    ];

    let typeOptions: Array<string> = [
        "Anomaly Detection",
        "Association Rule Learning",
        "Classification",
        "Clustering",
        "Computer Vision",
        "Deep Learning",
        "Dimensionality Reduction",
        "Natural Language Processing",
        "Regression",
        "Reinforcement Learning",
    ];

    interface Model {
        name: string;
        size: number;
        unit_size: string;
    }

    let models: Model[] = [
        {
            name: "CNN - LeNet-5",
            size: 86,
            unit_size: "kb",
        },
        {
            name: "CNN - VGG-Net",
            size: 452,
            unit_size: "kb",
        },
        {
            name: "RNN - LSTM",
            size: 12,
            unit_size: "kb",
        },
    ];

    function removeModel(modelName: string) {
        models = models.filter((model) => model.name !== modelName);
    }
</script>

<div class="relative grid items-center max-w-[1400px] mx-auto w-full text-sm sm:text-base min-h-screen -mt-[76px]">
    <div class="flex flex-col items-center justify-self-center w-1/2 bg-[#15223C] rounded-3xl py-[34px]">
        <div class="flex flex-col items-center">
            <h1 class="text-3xl font-medium">Upload your model</h1>
            <span class="text-sm text-gray-500 font-bold">only .py extension is available</span>
        </div>
        <div class="flex flex-col items-center w-full mt-[21px]">
            <div class="flex flex-col items-center w-full">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Model</h2>
                <SelectModel options={modelOptions}/>
            </div>
            <div class="flex flex-col items-center w-full mt-[13px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Type</h2>
                <SelectModel options={typeOptions} />
            </div>
        </div>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-[55px] py-[13px] rounded-2xl mt-[34px] text-2xl">
            Drag model here!
        </button>
        {#if models.length > 0}
            <div class="relative flex flex-col w-3/4 mt-[34px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Just uploaded model(s)</h2>
                <div class="relative flex flex-col gap-3">
                    {#each models as model (model.name)}
                        <UploadedItem {...model} on:remove={(e) => removeModel(e.detail)} />
                    {/each}
                </div>
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-[55px] py-[13px] rounded-2xl mt-[34px] text-2xl">
                Upload!
            </button>
        {/if}
    </div>
</div>
