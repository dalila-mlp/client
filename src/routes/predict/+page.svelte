<script lang="ts">
    import SelectModel from "../../components/upload/SelectModel.svelte";
    import UploadedItem from "../../components/upload/UploadedItem.svelte";

    let models: Array<string> = [
        "CNN - LeNet-5",
        "CNN - VGG-Net",
        "RNN - LSTM",
    ];

    interface Data {
        name: string;
        size: number;
        unit_size: string;
    }

    let datafiles: Data[] = [
        {
            name: "MNIST",
            size: 1.12,
            unit_size: "gb",
        },
    ];

    function removeData(modelName: string) {
        datafiles = datafiles.filter((datafile) => datafile.name !== modelName);
    }
</script>

<div class="relative grid items-center max-w-[1400px] mx-auto w-full text-sm sm:text-base min-h-screen -mt-[76px]">
    <div class="flex flex-col items-center justify-self-center w-1/2 bg-[#15223C] rounded-3xl py-[34px]">
        <div class="flex flex-col items-center">
            <h1 class="text-3xl font-medium">Run prediction</h1>
            <span class="text-sm text-gray-500 font-bold">chose model and datafile for prediction</span>
        </div>
        <div class="flex flex-col items-center w-full mt-[21px]">
            <div class="flex flex-col items-center w-full">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Model</h2>
                <SelectModel options={models}/>
            </div>
        </div>
        {#if datafiles.length > 0}
            <div class="relative flex flex-col w-3/4 mt-[13px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Just uploaded datafile</h2>
                <div class="relative flex flex-col gap-3">
                    {#each datafiles as datafile (datafile.name)}
                        <UploadedItem {...datafile} on:remove={(e) => removeData(e.detail)} />
                    {/each}
                </div>
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-[55px] py-[13px] rounded-2xl mt-[34px] text-2xl">
                Predict!
            </button>
        {:else}
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-[55px] py-[13px] rounded-2xl mt-[34px] text-2xl">
                Drag datafile to use here!
            </button>
        {/if}
    </div>
</div>
