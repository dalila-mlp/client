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
        filename: string;
        id: string;
        name: string;
        type: string;
        weight: number;
        weightUnitSize: string;
    };

    let models: Model[] = [];
    let selectedModel: string = modelOptions[0];
    let selectedType: string = typeOptions[0];
    let file: File | null = null;
    let fileInput: HTMLInputElement | null = null;
    
    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files[0]) {
            file = input.files[0];
        }
    }

    async function handleUpload() {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', selectedModel);
        formData.append('type', selectedType);

        try {
            const response = await fetch('http://192.168.218.129/model/create', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload');
            }

            const result = await response.json();
            models = [
                ...models,
                {
                    filename: result.filename,
                    id: result.id,
                    name: result.name,
                    type: result.type,
                    weight: result.weight,
                    weightUnitSize: result.weightUnitSize,
                }
            ];
            
            file = null;
            selectedModel = modelOptions[0];
            selectedType = typeOptions[0];

            if (fileInput) {
                fileInput.value = '';
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function removeModel(id: string) {
        try {
            const response = await fetch(`http://192.168.218.129/model/${id}/delete`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete model');
            }

            models = models.filter((model) => model.id !== id);
        } catch (error) {
            console.error(error);
        }
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
                <SelectModel bind:value={selectedModel} options={modelOptions}/>
            </div>
            <div class="flex flex-col items-center w-full mt-[13px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Type</h2>
                <SelectModel bind:value={selectedType} options={typeOptions} />
            </div>
        </div>
        <div class="flex font-bold mt-[34px] text-white text-2xl">
            <input
              id="fileInput"
              type="file"
              accept=".py"
              on:change={handleFileChange}
              class="hidden"
              bind:this={fileInput}
            />
            {#if file}
                <UploadedItem {...{filename: file.name}} on:remove={() => {file = null; fileInput.value = '';}} />
            {:else}
                <label
                    class="bg-blue-500 hover:bg-blue-700 cursor-pointer px-[55px] py-[13px] rounded-2xl"
                    for="fileInput"
                >
                    Drag model here!
                </label>
            {/if}
        </div>
        {#if file && selectedModel && selectedType}
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-[55px] py-[13px] rounded-2xl mt-[34px] text-2xl"
                on:click={handleUpload}
            >
                Upload
            </button>
        {/if}
        {#if models.length > 0}
            <div class="relative flex flex-col w-3/4 mt-[34px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Just uploaded model(s)</h2>
                <div class="relative flex flex-col gap-3">
                    {#each models as model (model.id)}
                        <UploadedItem {...model} on:remove={() => removeModel(model.id)} />
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>
