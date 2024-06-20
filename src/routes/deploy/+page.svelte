<script lang="ts">
    import { onMount } from "svelte";
    import { ToastContainer, FlatToast }  from "svelte-toasts";
    import SelectModel from "../../components/upload/SelectModel.svelte";
    import UploadedItem from "../../components/upload/UploadedItem.svelte";
    import axios from "../../utils/Axios/axios";
    import toast from "../../utils/Toast/default";

    interface Model {
        id: string;
        filename: string;
        name: string;
        type: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        uploadedBy: string;
        weight: number;
        weightUnitSize: string;
        flops: number;
        lastTrain: string;
        deployed: boolean;
    }

    let models: Model[] = [];
    let models_loaded: boolean = false;

    onMount(async () => {
        try {
            const response = await axios.get('/models');
            if(response.status !== 200) throw new Error((await response.data).message);
            const responseDatafile = await response.data;
            models = responseDatafile;
        } catch (error) {
            toast(error.message, "error")
        }

        models_loaded = true;
    });

    interface Terraform {
        id: string;
        filename: string;
        weight: number;
        weightUnitSize: string;
    }

    let terraform: Terraform|null = {
        id: "b01e6f83-dd77-4cf7-a893-5277e8e6ccfe",
        filename: "my_config",
        weight: 36,
        weightUnitSize: "kb",
    };

    function removeTerraform() {
        terraform = null;
    }

    let selectedModel: string = "Choose model";
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
    }
</script>

<div class="relative grid items-center max-w-[1400px] mx-auto w-full text-sm sm:text-base min-h-screen -mt-[76px]">
    {#if typeof window !== 'undefined'}
        <ToastContainer let:data={data}>
            <FlatToast {data} />
        </ToastContainer>
    {/if}
    <div class="flex flex-col items-center justify-self-center w-1/2 bg-[#15223C] rounded-3xl py-[34px]">
        <div class="flex flex-col items-center">
            <h1 class="text-3xl font-medium">Deploy model</h1>
            <span class="text-sm text-gray-500 font-bold">choose the model to deploy and upload your terraform conf</span>
        </div>
        <div class="flex flex-col items-center w-full mt-[21px]">
            <div class="flex flex-col items-center w-full">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Model</h2>
                <SelectModel bind:value={selectedModel} options={models.map(model => model.filename)}/>
            </div>
        </div>
        {#if !terraform}
            <div class="flex font-bold mt-[34px] text-white text-2xl">
                <input
                id="fileInput"
                type="file"
                accept=".tf"
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
                        Drag terraform file here!
                    </label>
                {/if}
            </div>
        {/if}
        {#if file && selectedModel}
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-[55px] py-[13px] rounded-2xl mt-[34px] text-2xl"
                on:click={handleUpload}
            >
                Upload
            </button>
        {/if}
        {#if terraform}
            <div class="relative flex flex-col w-3/4 mt-[13px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Terraform file</h2>
                <div class="relative flex flex-col">
                    <UploadedItem {...terraform} on:remove={() => removeTerraform()} />
                </div>
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-[55px] py-[13px] rounded-2xl mt-[34px] text-2xl">
                Deploy!
            </button>
        {/if}
    </div>
</div>
