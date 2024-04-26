<script lang="ts">
    import SelectModel from "../../components/upload/SelectModel.svelte";
    import UploadedItem from "../../components/upload/UploadedItem.svelte";

    let models: Array<string> = [
        "CNN - LeNet-5",
        "CNN - VGG-Net",
        "RNN - LSTM",
    ];

    interface Terraform {
        name: string;
        size: number;
        unit_size: string;
    }

    let terraform: Terraform|null = {
        name: "Terrafom config",
        size: 86,
        unit_size: "kb",
    };

    function removeTerraform() {
        terraform = null;
    }
</script>

<div class="relative grid items-center max-w-[1400px] mx-auto w-full text-sm sm:text-base min-h-screen -mt-[76px]">
    <div class="flex flex-col items-center justify-self-center w-1/2 bg-[#15223C] rounded-3xl py-[34px]">
        <div class="flex flex-col items-center">
            <h1 class="text-3xl font-medium">Deploy model</h1>
            <span class="text-sm text-gray-500 font-bold">choose the model to deploy and upload your terraform conf</span>
        </div>
        <div class="flex flex-col items-center w-full mt-[21px]">
            <div class="flex flex-col items-center w-full">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Model</h2>
                <SelectModel options={models}/>
            </div>
        </div>
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
        {:else}
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-[55px] py-[13px] rounded-2xl mt-[34px] text-2xl">
                Drag terraform file here!
            </button>
        {/if}
    </div>
</div>
